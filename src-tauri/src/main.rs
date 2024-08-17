// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use crate::commands::{fetch_container_info, fetch_containers, 
    get_container, stream_docker_logs, 
    container_operation, list_images, image_info, 
    image_history,
    delete_image,
    list_volumes,
    inspect_volume,
    list_networks,
    inspect_network
};
use crate::state::AppState;
mod commands;
mod state;

fn main() {
    let state = AppState::default();

    tauri::Builder::default()
        .manage(state)
        .invoke_handler(tauri::generate_handler![
            // fetch_version,
            fetch_containers,
            fetch_container_info,
            get_container,
            stream_docker_logs,
            container_operation,
            list_images,
            image_info,
            image_history,
            delete_image,
            list_volumes,
            inspect_volume,
            list_networks,
            inspect_network
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
