use crate::state::AppState;
use bollard::system::Version;
use std::sync::atomic::Ordering;

#[tauri::command]
pub fn cancel_stream(state: tauri::State<'_, AppState>, stream_type: String) {
    match stream_type.as_ref() {
        "stats" => state.cancel_stats.store(true, Ordering::Relaxed),
        "logs" => state.cancel_logs.store(true, Ordering::Relaxed),
        "terminal" => state.cancel_terminal_stream.store(true, Ordering::Relaxed),
        _ => {}
    };
}

#[tauri::command]
pub async fn get_version(state: tauri::State<'_, AppState>) -> Result<Version, String> {
    state.docker.version().await.map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn ping(state: tauri::State<'_, AppState>) -> Result<String, String> {
    state.docker.ping().await.map_err(|e| e.to_string())
}
