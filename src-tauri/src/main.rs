// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use crate::commands::container::{container_operation, container_stats, exec, fetch_container_info, fetch_containers, get_container, rename_container, stream_docker_logs};
use crate::commands::extra::{cancel_stream, get_version, ping};
use crate::commands::image::{delete_image, export_image, image_history, image_info, list_images};
use crate::commands::network::{inspect_network, list_networks};
use crate::commands::volume::{inspect_volume, list_volumes};
use crate::commands::terminal::get_available_terminals;
use crate::state::AppState;
use crate::utils::storage::setup_storage;

mod commands;
mod constants;
mod state;
mod utils;

fn main() {
    std::env::set_var("WEBKIT_DISABLE_COMPOSITING_MODE", "1");

    let state = AppState::default();

    tauri::Builder::default()
        .manage(state)
        .plugin(tauri_plugin_store::Builder::default().build())
        .setup(|app| {
            setup_storage(app);
            Ok(())
        })
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
            inspect_network,
            container_stats,
            cancel_stream,
            export_image,
            get_version,
            ping,
            get_available_terminals,
            rename_container,
            exec
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
