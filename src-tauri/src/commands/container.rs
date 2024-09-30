use crate::constants::DOCKER_TERMINAL_APP;
use crate::state::AppState;
use crate::utils::find_terminal;
use crate::utils::storage::get_storage_path;
use bollard::container::{
    ListContainersOptions, LogsOptions, RenameContainerOptions, StatsOptions,
};
use bollard::models::{ContainerInspectResponse, ContainerSummary};
use futures_util::{StreamExt, TryFutureExt};
use std::collections::HashMap;
use std::sync::atomic::Ordering;
use tauri::Manager;
use tauri_plugin_store::StoreBuilder;

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
        "exec" => open_container_shell(app_handle, container_name),
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

fn open_container_shell(
    app_handle: tauri::AppHandle,
    container_name: String,
) -> Result<String, String> {
    let term_commands_prefix: HashMap<String, String> = HashMap::from([
        ("gnome-terminal".to_owned(), "--".to_owned()),
        ("alacritty".to_owned(), "-e".to_owned()),
        ("xterm".to_owned(), "-e".to_owned()),
        ("terminator".to_owned(), "-x".to_owned()),
        ("konsole".to_owned(), "-e".to_owned()),
    ]);

    let mut store = StoreBuilder::new(app_handle.clone(), get_storage_path()).build();

    // Attempt to load the store, if it's saved already.
    store.load().map_err(|_| "Failed to load store from disk")?;

    let term_app;

    let stored_val = store.get(DOCKER_TERMINAL_APP);

    if stored_val.is_some_and(|val| val != "") {
        term_app = stored_val.unwrap().to_string().replace("\"", "");
    } else {
        term_app = find_terminal().unwrap();
    }

    let docker_commands = vec![
        "docker".to_owned(),
        "exec".to_owned(),
        "-it".to_owned(),
        container_name.to_owned(),
        "sh".to_owned(),
    ];

    let mut command = std::process::Command::new(term_app.clone());

    let term_arg = term_commands_prefix
        .get(term_app.as_str())
        .ok_or_else(|| format!("Terminal application '{}' not supported", term_app))?;

    command.args(std::iter::once(term_arg.to_owned()).chain(docker_commands));

    match command.spawn() {
        Ok(_) => Ok(format!("Opening terminal inside '{container_name}'")),
        Err(err) => match err.kind() {
            std::io::ErrorKind::NotFound => Err(format!(
                "cannot use '{}' to open terminal. Change it in settings.",
                term_app
            )),

            _ => Err(format!(
                "Cannot run exec command: {}",
                err.kind().to_string()
            )),
        },
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
