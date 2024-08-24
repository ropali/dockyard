use std::sync::atomic::Ordering;
use crate::state::AppState;

#[tauri::command]
pub fn cancel_stream(state: tauri::State<'_, AppState>, stream_type: String) {
    match stream_type.as_ref() {
        "stats" => state.cancel_stats.store(true, Ordering::Relaxed),
        "logs" => state.cancel_logs.store(true, Ordering::Relaxed),
        _ => {}
    };

}