use crate::constants::Terminal;
use std::process::Command;

pub fn open_terminal(term_app: &Terminal, command: &str) -> Result<(), String> {
    match std::env::consts::OS {
        "macos" => open_terminal_macos(term_app, command),
        "windows" => open_terminal_windows(term_app, command),
        _ => open_terminal_unix(term_app, command),
    }
}
pub async fn open_container_shell(
    container_name: String,
    terminal: Option<String>,
) -> Result<String, String> {
    let term_app = terminal
        .and_then(|t| Terminal::from_str(&t))
        .unwrap_or_default();
    let docker_command = format!("docker exec -it {} sh", container_name);

    open_terminal(&term_app, &docker_command)
        .map(|_| format!("Opening terminal inside '{}'", container_name))
}


fn open_terminal_macos(term_app: &Terminal, command: &str) -> Result<(), String> {
    if let Some(template) = term_app.command_template() {
        let script = template.replace("{}", &command.replace("\"", "\\\""));

        Command::new("osascript")
            .arg("-e")
            .arg(script)
            .spawn()
            .map(|_| ())
            .map_err(|err| format!("Failed to execute osascript command: {}", err))
    } else {
        let term_arg = term_app.command_prefix();
        let args: Vec<&str> = command.split_whitespace().collect();

        Command::new(term_app.as_str())
            .arg(term_arg)
            .args(&args)
            .spawn()
            .map(|_| ())
            .map_err(|err| format!("Failed to execute terminal command: {}", err))
    }
}

fn open_terminal_windows(term_app: &Terminal, command: &str) -> Result<(), String> {
    let term_arg = term_app.command_prefix();
    let args: Vec<&str> = command.split_whitespace().collect();

    Command::new(term_app.as_str())
        .arg(term_arg)
        .args(&args)
        .spawn()
        .map(|_| ())
        .map_err(|err| format!("Failed to execute terminal command: {}", err))
}

fn open_terminal_unix(term_app: &Terminal, command: &str) -> Result<(), String> {
    let term_arg = term_app.command_prefix();
    let args: Vec<&str> = command.split_whitespace().collect();

    Command::new(term_app.as_str())
        .arg(term_arg)
        .args(&args)
        .spawn()
        .map(|_| ())
        .map_err(|err| format!("Failed to execute terminal command: {}", err))
}


