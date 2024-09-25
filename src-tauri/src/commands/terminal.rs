use crate::utils::terminal::Terminal;
#[tauri::command]
pub fn get_available_terminals() -> Vec<String> {
    let current_os = if cfg!(target_os = "windows") {
        "windows"
    } else if cfg!(target_os = "macos") {
        "macos"
    } else {
        "linux"
    };

    let variants = Terminal::variants();

    variants
        .iter()
        .filter(|t| t.os() == current_os)
        .map(|t| t.app_name().to_string())
        .collect()
}
