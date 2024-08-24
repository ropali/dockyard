use std::collections::HashMap;
use std::sync::atomic::Ordering;
use bollard::container::{ListContainersOptions, LogsOptions, StatsOptions};
use bollard::models::{ContainerInspectResponse, ContainerSummary};
use futures_util::StreamExt;
use tauri::Manager;
use crate::state::AppState;

#[tauri::command]
pub async fn fetch_containers(
    state: tauri::State<'_, AppState>,
) -> Result<Vec<ContainerSummary>, String> {
    let opts = ListContainersOptions::<String> {
        all: true,
        ..Default::default()
    };

    state
        .docker
        .clone()
        .list_containers(Some(opts))
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn get_container(
    state: tauri::State<'_, AppState>,
    c_id: String,
) -> Result<ContainerSummary, String> {
    let mut list_container_filters = HashMap::new();
    list_container_filters.insert(String::from("id"), vec![c_id]);

    let opts = ListContainersOptions::<String> {
        all: false,
        filters: list_container_filters,
        ..Default::default()
    };

    state
        .docker
        .clone()
        .list_containers(Some(opts))
        .await
        .map_err(|e| e.to_string())?
        .into_iter()
        .next()
        .ok_or_else(|| "Container not found".to_string())
}

#[tauri::command]
pub async fn fetch_container_info(
    state: tauri::State<'_, AppState>,
    c_id: String,
) -> Result<ContainerInspectResponse, String> {
    state
        .docker
        .clone()
        .inspect_container(c_id.as_str(), None)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn stream_docker_logs(
    state: tauri::State<'_, AppState>,
    app_handle: tauri::AppHandle,
    container_name: String,
) -> Result<(), String> {

    state.cancel_logs.store(false, Ordering::Relaxed);

    let mut stream = state.docker.logs::<String>(
        &container_name,
        Some(LogsOptions {
            follow: true,
            stdout: true,
            stderr: false,
            ..Default::default()
        }),
    );

    while let Some(msg) = stream.next().await {

        if state.cancel_logs.load(Ordering::Relaxed) {
            break;
        }

        let log = msg.unwrap().to_string();

        app_handle
            .emit_all("log_chunk", log)
            .expect("Failed to emit log chunk");
    }

    Ok(())
}

#[tauri::command]
pub async fn container_operation(
    state: tauri::State<'_, AppState>,
    container_name: String,
    op_type: String,
) -> Result<String, String> {
    let docker = state.docker.clone();

    let mut list_container_filters = std::collections::HashMap::new();
    list_container_filters.insert(String::from("name"), vec![container_name.clone()]);

    let opts = ListContainersOptions::<String> {
        all: true,
        filters: list_container_filters,
        ..Default::default()
    };

    let container = docker
        .list_containers(Some(opts))
        .await
        .map_err(|e| e.to_string())?
        .into_iter()
        .next()
        .ok_or_else(|| "Container not found".to_string())?;

    let res = match op_type.as_str() {
        "delete" => match docker.remove_container(&container_name, None).await {
            Ok(_) => Ok("Deleted container".to_string()),
            Err(e) => Err(format!("Failed to delete container: {}", e.to_string())),
        },
        "start" => match docker
            .start_container::<String>(&container_name, None)
            .await
        {
            Ok(_) => Ok("Container started".to_string()),
            Err(e) => Err(format!("Failed to start container: {}", e.to_string())),
        },
        "stop" => match docker.stop_container(&container_name, None).await {
            Ok(_) => Ok("Container stopped".to_string()),
            Err(e) => Err(format!("Failed to stop container: {}", e.to_string())),
        },
        "restart" => match docker.restart_container(&container_name, None).await {
            Ok(_) => Ok("Container restarted".to_string()),
            Err(e) => Err(format!("Failed to restart container: {}", e.to_string())),
        },
        "web" => {
            let path = format!(
                "http://0.0.0.0:{}",
                container.ports.unwrap()[0]
                    .public_port
                    .ok_or_else(|| "Port not available".to_string())?
            );
            match open::that(path.clone()) {
                Ok(_) => Ok(format!("Opening '{}'.", path)),
                Err(err) => Err(format!("Failed to open '{}': {}", path, err)),
            }
        }
        "exec" => {
            let docker_command = format!("docker exec -it {} sh", container_name);

            let mut command = std::process::Command::new("gnome-terminal");
            let args = ["--", "bash", "-c", &docker_command];

            command.args(&args);
            match command.spawn() {
                Ok(_) => Ok("Exec command executed".to_string()),
                Err(err) => Err(format!("Cannot run exec command: {}", err.to_string())),
            }
        }
        _ => Err("Invalid operation type".to_string()),
    };

    res
}

#[tauri::command]
pub async fn container_stats(
    state: tauri::State<'_, AppState>,
    app_handle: tauri::AppHandle,
    c_id: String,
) -> Result<(), String> {
    let options = Some(StatsOptions {
        stream: true,
        one_shot: false,
    });

    let stream = &mut state.docker.stats(&c_id, options);

    state.cancel_stats.store(false, Ordering::Relaxed);

    while let Some(Ok(stats)) = stream.next().await {

        if state.cancel_stats.load(Ordering::Relaxed) {
            break;  // Stop emitting events if the flag is set
        }

        app_handle
            .emit_all("stats", stats)
            .expect("Failed to emit stats data");
    }

    Ok(())
}