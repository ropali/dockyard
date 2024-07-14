// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use rs_docker::{
    container::{Container, ContainerInfo},
    version::Version,
};

mod docker_service;

struct AppState {
    containers: Vec<Container>,
}

impl AppState {
    fn default() -> Self {
        return AppState {
            containers: docker_service::get_containers(),
        };
    }
}

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn fetch_containers() -> Vec<Container> {
    return docker_service::get_containers();
}

#[tauri::command]
fn fetch_container_info(state: tauri::State<AppState>, c_id: String) -> ContainerInfo {
    print!("---ID {}", c_id);
    let container = state.containers.iter().find(|c| c.Id == c_id).expect("Can't find container withd Id {c_id}");

    return docker_service::get_container_info(container);
}

#[tauri::command]
fn fetch_version() -> Version {
    return docker_service::get_version();
}

fn main() {
    let state = AppState::default();

    tauri::Builder::default()
        .manage(state)
        .invoke_handler(tauri::generate_handler![fetch_containers, fetch_version, fetch_container_info])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
