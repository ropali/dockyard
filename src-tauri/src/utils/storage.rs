use std::path::PathBuf;
use tauri::{App, Manager, Wry};
use tauri_plugin_store::{with_store, StoreCollection};

pub fn setup_storage(app: &mut App) {
    let stores = app.state::<StoreCollection<Wry>>();

    // TODO: handle case for other OS types
    let home_dir = std::env::var_os("HOME").ok_or("no home directory").unwrap();

    let mut path = PathBuf::new();

    path.push(format!("{}/.dockyard/store.bin", home_dir.into_string().unwrap()));

    with_store(app.handle(), stores, path, |_| { Ok(()) }).expect("Failed to initialize store");
}