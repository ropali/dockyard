// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use rust_dock::{
    container::{Container, ContainerInfo},
    version::Version,
    Docker,
};
use tauri::Manager;
use tokio::sync::mpsc;

mod docker_service;

struct AppState {
    containers: Vec<Container>,
    // docker: Docker
}

impl AppState {
    fn default() -> Self {
        return AppState {
            containers: docker_service::get_containers(),
            // docker: Docker::connect(addr)
        };
    }
}

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn fetch_containers() -> Vec<Container> {
    return docker_service::get_containers();
}

#[tauri::command]
fn fetch_container_info(state: tauri::State<AppState>, c_id: String) -> ContainerInfo {
    let container = state
        .containers
        .iter()
        .find(|c| c.Id == c_id)
        .expect("Can't find container withd Id {c_id}");

    return docker_service::get_container_info(container);
}

#[tauri::command]
fn fetch_version() -> Version {
    return docker_service::get_version();
}

#[tauri::command]
async fn stream_docker_logs(
    app_handle: tauri::AppHandle,
    container_id: String,
) -> Result<(), String> {
    let docker = Docker::connect("unix:///var/run/docker.sock").map_err(|e| e.to_string())?;

    let (sender, mut receiver) = mpsc::channel(100);


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

// the payload type must implement `Serialize` and `Clone`.
#[derive(Clone, serde::Serialize)]
struct Payload {
    message: String,
}

fn main() {
    let state = AppState::default();

    tauri::Builder::default()
        .manage(state)
        .invoke_handler(tauri::generate_handler![
            fetch_containers,
            fetch_version,
            fetch_container_info,
            stream_docker_logs
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
