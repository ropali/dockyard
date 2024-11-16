use crate::state::AppState;
use crate::utils::storage::get_user_download_dir;
use crate::utils::terminal::{get_terminal, open_terminal};
use bollard::container::{ListContainersOptions, LogsOptions, RenameContainerOptions, StatsOptions};
use bollard::exec::{CreateExecOptions, StartExecResults};
use bollard::models::{ContainerInspectResponse, ContainerSummary};
use futures_util::StreamExt;
use shellish_parse::{parse as parse_shellish, ParseOptions};
use std::collections::HashMap;
use std::io::ErrorKind;
use std::sync::atomic::Ordering;
use tauri::Manager;
use tokio::fs::File;
use tokio::io::AsyncWriteExt;

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
        all: true,
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
    app_handle: tauri::AppHandle,
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
        "web" => open_container_url(container),
        "exec" => {
            let terminal = get_terminal(&app_handle).await.map_err(|e| e.to_string())?;
            match open_terminal(&terminal, Some("exec"), Some(&container_name)) {
                Ok(_) => Ok("Opening terminal".to_string()),
                Err(e) => {
                    let error_msg = e.to_string();

                    if error_msg.contains("deprecated") {
                        Ok("Terminal opened".to_string())
                    } else {
                        Err(format!("Failed to open terminal: {}", error_msg))
                    }
                }
            }
        }
        _ => Err("Invalid operation type".to_string()),
    };

    res
}

fn open_container_url(container: ContainerSummary) -> Result<String, String> {
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
            break; // Stop emitting events if the flag is set
        }

        app_handle
            .emit_all("stats", stats)
            .expect("Failed to emit stats data");
    }

    Ok(())
}

#[tauri::command]
pub async fn rename_container(
    state: tauri::State<'_, AppState>,
    name: String,
    new_name: String,
) -> Result<String, String> {
    let opts = RenameContainerOptions { name: &new_name };
    state
        .docker
        .rename_container(&name, opts)
        .await
        .map(|_| {
            format!(
                "Container '{}' successfully renamed to '{}'",
                name, new_name
            )
        })
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn exec(state: tauri::State<'_, AppState>, app_handle: tauri::AppHandle, c_name: String, command: String) -> Result<(), String> {
    let shellish_opts = ParseOptions::new()
        .allow_comments_within_elements();

    let parsed_cmd = match parse_shellish(&command, shellish_opts) {
        Ok(res) => res,
        Err(e) => panic!("Failed to parse command: {}", e),
    };


    let config = CreateExecOptions {
        cmd: Some(parsed_cmd),
        attach_stdout: Some(true),
        attach_stdin: Some(true),
        ..Default::default()
    };

    let exec = state.docker
        .create_exec(
            c_name.as_str(),
            config,
        )
        .await
        .expect("Failed to create exec");

    let exec_result = state.docker.start_exec(&exec.id, None).await.expect("Failed to start exec");


    // Start the Exec command
    if let StartExecResults::Attached { mut output, .. } = exec_result {
        // Capture the output stream
        while let Some(chunk) = output.next().await {
            println!("Chunk Recv: {:#?}", chunk);
            match chunk {
                Ok(output_chunk) => {
                    app_handle
                        .emit_all("terminal_stdout", String::from_utf8_lossy(&output_chunk.into_bytes()).to_owned())
                        .expect("Failed to emit terminal_stdout data");
                }
                Err(e) => {
                    eprintln!("Error while receiving output: {}", e);
                    break;
                }
            }
        }

        // Send chars to end the output stream
        app_handle
            .emit_all("terminal_stdout", "\n#$")
            .expect("Failed to emit terminal_stdout data");
    } else {
        eprintln!("Failed to attach to the exec instance.");
    }

    Ok(())
}
#[tauri::command]
pub async fn export_container(state: tauri::State<'_, AppState>, name: String) -> Result<String, String> {
    let download_dir = get_user_download_dir()?;

    let path = format!("{download_dir}/{name}.tar.gz");

    let file_result = File::create_new::<&str>(path.as_ref()).await;
    match file_result {
        Ok(mut file) => {
            let mut stream = state.docker.export_container(&name);
            while let Some(response) = stream.next().await {
                file.write_all(&response.unwrap()).await.unwrap();
            }
            Ok(String::from(format!("Image exported at {}", path.clone())))
        }
        Err(err) => {
            let kind = err.kind();
            match kind {
                ErrorKind::PermissionDenied => Err(String::from(format!("Permission denied to open target file: {path}"))),
                ErrorKind::AlreadyExists => Err(String::from(format!("Target file already exist at {path}"))),
                _ => Err(String::from(format!("Failed to open target file: {path}")))
            }
        }
    }
}