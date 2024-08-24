use bollard::image::{ListImagesOptions, RemoveImageOptions};
use bollard::models::{HistoryResponseItem, ImageDeleteResponseItem, ImageInspect, ImageSummary};
use crate::state::AppState;

#[tauri::command]
pub async fn list_images(state: tauri::State<'_, AppState>) -> Result<Vec<ImageSummary>, String> {
    let options = Some(ListImagesOptions {
        all: true,
        ..Default::default()
    });

    state
        .docker
        .list_images::<String>(options)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn image_info(
    state: tauri::State<'_, AppState>,
    name: String,
) -> Result<ImageInspect, String> {
    state
        .docker
        .inspect_image(&name)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn image_history(
    state: tauri::State<'_, AppState>,
    name: String,
) -> Result<Vec<HistoryResponseItem>, String> {
    state
        .docker
        .image_history(&name)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn delete_image(
    state: tauri::State<'_, AppState>,
    image_name: String,
    force: bool,
    no_prune: bool,
) -> Result<Vec<ImageDeleteResponseItem>, String> {
    let remove_options = Some(RemoveImageOptions {
        force,
        noprune: no_prune,
        ..Default::default()
    });

    state
        .docker
        .remove_image(&image_name, remove_options, None)
        .await
        .map_err(|e| e.to_string())
}