use crate::constants::Terminal;
use crate::constants::DOCKER_TERMINAL;
use crate::utils::storage::get_storage_path;
use serde_json::json;
use tauri::AppHandle;
use tauri_plugin_store::StoreBuilder;

pub async fn save_terminal(app_handle: AppHandle, terminal: String) -> Result<(), String> {
    let mut store = StoreBuilder::new(app_handle.clone(), get_storage_path()).build();
    store
        .load()
        .map_err(|_| "Failed to load store from disk".to_string())?;
    store
        .insert(DOCKER_TERMINAL.to_string(), json!(terminal))
        .map_err(|_| "Failed to save terminal app".to_string())?;
    store
        .save()
        .map_err(|_| "Failed to save store to disk".to_string())
}

pub async fn get_terminal(app_handle: AppHandle) -> Result<String, String> {
    let mut store = StoreBuilder::new(app_handle.clone(), get_storage_path()).build();
    store
        .load()
        .map_err(|_| "Failed to load store from disk".to_string())?;
    store
        .get(DOCKER_TERMINAL)
        .ok_or("Terminal app not found".to_string())
        .and_then(|val| {
            val.as_str()
                .map(|s| s.to_string())
                .ok_or("Invalid terminal app value".to_string())
        })
}

#[tauri::command]
pub async fn set_terminal(app_handle: tauri::AppHandle, terminal: String) -> Result<(), String> {
    save_terminal(app_handle, terminal).await
}

#[tauri::command]
pub async fn get_terminal_command(app_handle: tauri::AppHandle) -> Result<String, String> {
    get_terminal(app_handle).await
}

#[tauri::command]
pub fn get_available_terminals() -> Vec<String> {
    Terminal::variants()
        .iter()
        .map(|t| t.as_str().to_string())
        .collect()
}

