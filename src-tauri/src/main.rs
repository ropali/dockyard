// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::Manager;

use crate::commands::{
    container_operation,
    delete_image,
    fetch_container_info,
    fetch_containers,
    fetch_version,
    get_container,
    image_history,
    image_info,
    list_images,
    stream_docker_logs,
};
use crate::state::AppState;

mod commands;
mod state;

fn main() {
    let state = AppState::default();

    tauri::Builder::default()
        .manage(state)
        .invoke_handler(tauri::generate_handler![
            fetch_containers,
            fetch_version,
            fetch_container_info,
            stream_docker_logs,
            container_operation,
            get_container,
            list_images,
            image_info,
            image_history,
            delete_image
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
