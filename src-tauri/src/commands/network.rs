use bollard::models::Network;
use bollard::network::InspectNetworkOptions;
use crate::state::AppState;

#[tauri::command]
pub async fn list_networks(state: tauri::State<'_, AppState>) -> Result<Vec<Network>, String> {
    state
        .docker
        .list_networks::<String>(None)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn inspect_network(
    state: tauri::State<'_, AppState>,
    name: String,
) -> Result<Network, String> {
    let config = InspectNetworkOptions {
        verbose: true,
        scope: "global",
    };
    state
        .docker
        .inspect_network(&name, Some(config))
        .await
        .map_err(|e| e.to_string())
}