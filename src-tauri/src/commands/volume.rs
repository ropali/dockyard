use bollard::models::{Volume, VolumeListResponse};
use crate::state::AppState;

#[tauri::command]
pub async fn list_volumes(state: tauri::State<'_, AppState>) -> Result<VolumeListResponse, String> {
    state
        .docker
        .list_volumes::<String>(None)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn inspect_volume(
    state: tauri::State<'_, AppState>,
    name: String,
) -> Result<Volume, String> {
    state
        .docker
        .inspect_volume(&name)
        .await
        .map_err(|e| e.to_string())
}