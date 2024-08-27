use std::path::PathBuf;
use tauri::{App, Manager, Wry};
use tauri_plugin_store::{with_store, StoreCollection};

use crate::constants::{STORAGE_NAME};


pub fn get_user_home_dir() -> Option<String> {
    let home_dir = std::env::var_os("HOME");

    match home_dir {
        Some(value) => Option::from(value.into_string().unwrap()),
        _ => None
    }
}

pub fn get_storage_path() -> PathBuf {
    let home_dir = get_user_home_dir().unwrap();

    let mut path = PathBuf::new();

    path.push(format!("{}/.dockyard/{STORAGE_NAME}", home_dir));

    path
}

pub fn setup_storage(app: &mut App) {
    let stores = app.state::<StoreCollection<Wry>>();

    // TODO: handle case for other OS types
    let path = get_storage_path();

    with_store(app.handle(), stores, path, |_| { Ok(()) }).expect("Failed to initialize store");
}