use std::ffi::OsString;
use std::path::PathBuf;
use tauri::{App, Manager, Wry};
use tauri_plugin_store::{with_store, StoreCollection};


pub fn get_user_home_dir() -> Option<String>{
    let home_dir = std::env::var_os("HOME");

    match home_dir {
        Some(value) => Option::from(value.into_string().unwrap()),
        _ => None
    }
}

pub fn setup_storage(app: &mut App) {
    let stores = app.state::<StoreCollection<Wry>>();

    // TODO: handle case for other OS types
    let home_dir = get_user_home_dir().unwrap();

    let mut path = PathBuf::new();

    path.push(format!("{}/.dockyard/store.bin", home_dir));

    with_store(app.handle(), stores, path, |_| { Ok(()) }).expect("Failed to initialize store");
}