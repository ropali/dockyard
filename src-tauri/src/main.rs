// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::process::Command;

use rust_dock::{container::Container, image::{Image, ImageHistory}, version::Version};
use tauri::Manager;
use tokio::sync::mpsc;

use crate::state::AppState;

mod state;


#[tauri::command]
fn fetch_containers(state: tauri::State<AppState>) -> Vec<Container> {
    state.docker.clone().get_containers(true).expect("")
}

#[tauri::command]
fn get_container(state: tauri::State<AppState>, c_id: String) -> Container {
    let containers = state.docker.clone().get_containers(true).expect("");

    return containers
        .iter()
        .find(|c| c.Id == c_id)
        .expect("Container not found")
        .clone();
}

#[tauri::command]
fn fetch_container_info(state: tauri::State<AppState>, c_id: String) -> serde_json::Value {
    state.docker.clone().get_container_info_raw(&c_id).unwrap()
}

#[tauri::command]
fn fetch_version(state: tauri::State<AppState>) -> Version {
    state.docker.clone().get_version().expect("")
}

#[tauri::command]
async fn stream_docker_logs(
    state: tauri::State<'_, AppState>,
    app_handle: tauri::AppHandle,
    container_id: String,
) -> Result<(), String> {
    let (sender, mut receiver) = mpsc::channel(100);

    let docker = state.docker.clone();

    tokio::spawn(async move {
        if let Err(err) = docker.stream_container_logs(&container_id, sender).await {
            eprintln!("Error streaming logs: {}", err);
        }
    });

    tokio::spawn(async move {
        while let Some(log_chunk) = receiver.recv().await {
            app_handle
                .emit_all("log_chunk", log_chunk)
                .expect("Failed to emit log chunk");
        }
    });

    Ok(())
}

#[tauri::command]
fn container_operation(state: tauri::State<AppState>, c_id: String, op_type: String) -> String {
    let containers = state.docker.clone().get_containers(true).expect("");

    let container = containers
        .iter()
        .find(|c| c.Id == c_id)
        .expect("Can't find container");

    // TODO: Improve error handling
    let res = match op_type.as_str() {
        "delete" => match state.docker.clone().delete_container(&c_id) {
            Ok(_) => &format!("Deleted container"),
            Err(e) => &format!("Failed to delete container: {}", e.to_string()),
        },
        "start" => match state.docker.clone().start_container(&c_id) {
            Ok(_) => &format!("Container started"),
            Err(e) => &format!("Failed to delete container: {}", e.to_string()),
        },
        "stop" => match state.docker.clone().stop_container(&c_id) {
            Ok(_) => &format!("Container stopped"),
            Err(e) => &format!("Failed to delete container: {}", e.to_string()),
        },
        "restart" => {
            let _ = match state.docker.clone().stop_container(&c_id) {
                Ok(_) => &format!("Container restarted"),
                Err(e) => &format!("Failed to delete container: {}", e.to_string()),
            };

            let res = match state.docker.clone().start_container(&c_id) {
                Ok(_) => &format!("Container restarted"),
                Err(e) => &format!("Failed to delete container: {}", e.to_string()),
            };

            return res.to_string();
        }
        "web" => {
            let path = format!(
                "http://0.0.0.0:{}",
                container.Ports[0].PublicPort.expect("port not available")
            );
            match open::that(path.clone()) {
                Ok(()) => &format!("Opening '{}'.", path),
                Err(err) => &format!("An error occurred when opening '{}': {}", path, err),
            }
        }

        "exec" => {
            // TODO: Make it platform/os agnostic
            let container_name = container.Names[0].replace("/", ""); // Replace with your container name
            let docker_command = format!("docker exec -it {} sh", container_name);

            // Using gnome-terminal to run the docker command
            let mut command = Command::new("gnome-terminal");

            // -e flag is used to execute the command in gnome-terminal
            let args = ["--", "bash", "-c", &docker_command];

            command.args(&args);
            match command.spawn() {
                Ok(_) => "",
                Err(err) => &format!("Cannot run exec command: {}", err.to_string()),
            }
        }
        _ => "Invalid operation type",
    };

    return res.to_string();
}

#[tauri::command]
fn list_images(state: tauri::State<AppState>) -> Vec<Image> {
    state.docker.clone().get_images(true).unwrap()
}

#[tauri::command]
fn image_info(state: tauri::State<AppState>, name: String) -> serde_json::Value {
    state.docker.clone().inspect_image(&name).unwrap()
}


#[tauri::command]
fn image_history(state: tauri::State<AppState>, name: String) -> Vec<ImageHistory> {
    state.docker.clone().image_history(&name).unwrap()
}

#[tauri::command]
fn delete_image(state: tauri::State<AppState>, id: String, force: bool, no_prune: bool) -> &str {
    state.docker.clone().delete_image(&id, force, no_prune).unwrap();

    "Deleted Image"
}


fn main() {
    let state = AppState::default();

    tauri::Builder::default()
        .manage(state)
        .invoke_handler(tauri::generate_handler![
            fetch_containers,
            fetch_version,
            fetch_container_info,
            stream_docker_logs,
            container_operation,
            get_container,
            list_images,
            image_info,
            image_history,
            delete_image
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
