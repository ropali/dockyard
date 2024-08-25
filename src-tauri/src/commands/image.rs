use std::io::ErrorKind;
use std::path::PathBuf;
use crate::state::AppState;
use crate::utils::storage::get_user_home_dir;
use bollard::image::{ListImagesOptions, RemoveImageOptions};
use bollard::models::{HistoryResponseItem, ImageDeleteResponseItem, ImageInspect, ImageSummary};
use futures_util::StreamExt;
use tokio::fs::File;
use tokio::io::AsyncWriteExt;

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

#[tauri::command]
pub async fn export_image(state: tauri::State<'_, AppState>, image_name: String) -> Result<String, String> {
    let home_dir = get_user_home_dir().unwrap();

    let path = format!("{home_dir}/{image_name}.tar.gz");


    let file_result = File::create_new::<&str>(path.as_ref()).await;
    match file_result {
        Ok(mut file) => {
            // Proceed with writing to the file
            let mut stream = state.docker.export_image(&image_name);
            while let Some(response) = stream.next().await {
                file.write_all(&response.unwrap()).await.unwrap();
            }
            Ok(String::from(format!("Image exported at {}", path.clone())))
        }
        Err(err) => {
            // Handle the error: log it, return an error message, etc.
            let kind = err.kind();
            match kind {
                ErrorKind::PermissionDenied => Err(String::from(format!("Permission denied to open target file: {path}"))),
                ErrorKind::AlreadyExists => Err(String::from(format!("Target file already exist at {path}"))),
                _ => Err(String::from(format!("Failed to open target file: {path}")))
            }
        }
    }
}