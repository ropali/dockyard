use std::env;
use std::env::VarError;
use std::path::{Path, PathBuf};
use tauri::{App, Manager, Wry};
use tauri_plugin_store::{with_store, StoreCollection};

use crate::constants::STORAGE_NAME;


pub fn get_user_home_dir() -> Option<String> {
    let home_dir = std::env::var_os("HOME");

    match home_dir {
        Some(value) => Option::from(value.into_string().unwrap()),
        _ => None
    }
}

pub fn get_user_download_dir() -> Result<String, String> {
    let downloads_path = if cfg!(target_os = "windows") {
        env::var("USERPROFILE")
            .map(|profile| Path::new(&profile).join("Downloads"))
            .map_err(|_| "Could not find USERPROFILE environment variable.".to_string())?
    } else if cfg!(target_os = "macos") || cfg!(target_os = "linux") {
        env::var("HOME")
            .map(|home| Path::new(&home).join("Downloads"))
            .map_err(|_| "Could not find HOME environment variable.".to_string())?
    } else {
        return Err("Unsupported operating system.".to_string());
    };

    downloads_path
        .to_str()
        .map(|s| s.to_string())
        .ok_or_else(|| "Failed to convert path to string.".to_string())
}

pub fn get_storage_path() -> PathBuf {
    
    let mut path = PathBuf::new();

    path.push(format!(".{STORAGE_NAME}"));

    path
}

pub fn setup_storage(app: &mut App) {
    let stores = app.state::<StoreCollection<Wry>>();

    // TODO: handle case for other OS types
    let path = get_storage_path();

    with_store(app.handle(), stores, path, |_| { Ok(()) }).expect("Failed to initialize store");
}