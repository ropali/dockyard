// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::Manager;

use crate::commands::{
    container_operation, container_stats, delete_image, fetch_container_info, fetch_containers,
    get_container, image_history, image_info, inspect_network, inspect_volume, list_images,
    list_networks, list_volumes, stream_docker_logs,
};
use crate::state::AppState;
mod commands;
mod state;

fn main() {
    let state = AppState::default();

    tauri::Builder::default()
        .setup(|app| {
            // listen to the `event-name` (emitted on any window)
            let id = app.listen_global("stats", |event| {
                println!("got event-name with payload {:?}", event.payload());
            });
            // unlisten to the event using the `id` returned on the `listen_global` function
            // a `once_global` API is also exposed on the `App` struct
            app.unlisten(id);

           
            Ok(())
        })
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
            inspect_network,
            container_stats
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
