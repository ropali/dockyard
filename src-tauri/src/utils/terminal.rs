use crate::constants::DOCKER_TERMINAL;
use crate::constants::{LINUX_COMMAND_TEMPLATE, MACOS_COMMAND_TEMPLATE, WINDOWS_COMMAND_TEMPLATE};
use crate::utils::storage::get_storage_path;
use std::io::Read;
use std::process::Command;
use tauri::{AppHandle, Wry};
use tauri_plugin_store::StoreExt;

macro_rules! define_terminals {
    ($($name:ident => $app_name:expr, $template:expr, $os:expr),*) => {
        #[derive(Debug, Clone, Copy)]
        pub enum Terminal {
            $($name),*
        }

        impl Terminal {
            pub fn app_name(&self) -> &'static str {
                match self {
                    $(Terminal::$name => $app_name),*
                }
            }

            pub fn command_template(&self) -> &'static str {
                match self {
                    $(Terminal::$name => $template),*
                }
            }

            pub fn os(&self) -> &'static str {
                match self {
                    $(Terminal::$name => $os),*
                }
            }

            pub fn from_str(s: &str) -> Result<Self, String> {
                match s {
                    $($app_name => Ok(Terminal::$name)),*,
                    _ => Err(format!("Unknown terminal: {}", s)),
                }
            }

            pub fn variants() -> &'static [Terminal] {
                if cfg!(target_os = "windows") {
                    &[Terminal::Cmd, Terminal::Powershell]
                } else if cfg!(target_os = "macos") {
                    &[Terminal::Terminal, Terminal::ITerm, Terminal::WezTerm]
                } else {
                    &[
                        Terminal::GnomeTerminal,
                        Terminal::Konsole,
                        Terminal::Alacritty,
                        Terminal::Xterm,
                        Terminal::Terminator,
                        Terminal::Xfce4Terminal
                    ]
                }
            }
        }
    };
}

define_terminals!(
    GnomeTerminal => "gnome-terminal", LINUX_COMMAND_TEMPLATE, "linux",
    Konsole => "konsole", LINUX_COMMAND_TEMPLATE, "linux",
    Alacritty => "alacritty", LINUX_COMMAND_TEMPLATE, "linux",
    Xterm => "xterm", LINUX_COMMAND_TEMPLATE, "linux",
    Terminator => "terminator", LINUX_COMMAND_TEMPLATE, "linux",
    Xfce4Terminal => "xfce4-terminal", LINUX_COMMAND_TEMPLATE, "linux",
    Cmd => "cmd.exe", WINDOWS_COMMAND_TEMPLATE, "windows",
    Powershell => "powershell.exe", WINDOWS_COMMAND_TEMPLATE, "windows",
    Terminal => "Terminal", MACOS_COMMAND_TEMPLATE, "macos",
    ITerm => "iTerm", MACOS_COMMAND_TEMPLATE, "macos",
    WezTerm => "WezTerm", MACOS_COMMAND_TEMPLATE, "macos"
);

// A fallback mechanism to figure out the default installed terminal on the system
pub fn find_default_terminal() -> Option<Terminal> {
    println!("Checking default terminal");
    for terminal in Terminal::variants() {
        let app_name = terminal.app_name();
        println!("Checking terminal: {}", app_name);
        let command = if cfg!(target_os = "windows") {
            "where"
        } else {
            "which"
        };
        println!("Checking command: {}", command);
        let output = if cfg!(target_os = "windows") {
            Command::new("cmd.exe").args(&[command, app_name]).output()
        } else {
            Command::new(command).arg(app_name).output()
        };
        if let Ok(output) = output {
            if output.status.success() {
                return Some(*terminal);
            }
        }
    }
    None
}

pub async fn get_terminal(app: &AppHandle<Wry>) -> Result<Terminal, String> {
    let path = get_storage_path();
    let path = path.as_path();

    let store = app
        .store(path)
        .map_err(|e| format!("Failed to access store path: {}", e))?;
    let terminal_str = match store.get(DOCKER_TERMINAL) {
        Some(value) => Ok(value.clone()),
        None => {
            // Find the terminal if not found in storage
            if let Some(terminal) = find_default_terminal() {
                let terminal_app_name = terminal.app_name().to_string();
                store.set(DOCKER_TERMINAL, terminal_app_name.clone());

                // Return the found terminal app name
                Ok(terminal_app_name.into())
            } else {
                Err(format!("Store \"{:?}\" not found", path))
            }
        }
    }
    .map_err(|e| format!("Failed to retrieve terminal from storage: {}", e))?;
   
    let terminal_str = terminal_str.as_str().unwrap_or_default().to_string();

    if terminal_str.is_empty() {
        let default_terminal = find_default_terminal()
            .ok_or_else(|| "No default terminal found".to_string())?;
        return Terminal::from_str(default_terminal.app_name());
    }

    Terminal::from_str(&terminal_str).map_err(|e| format!("Invalid terminal string: {}", e))
}

pub fn open_terminal(
    term_app: &Terminal,
    command: Option<&str>,
    container_name: Option<&str>,
) -> Result<String, String> {
    let command = match command {
        Some("exec") => match container_name {
            Some(container) => format!("docker exec -it {} sh", container),
            None => return Err("Container name must be provided for 'exec' command".to_string()),
        },
        Some(cmd) => cmd.to_string(),
        None => return Err("No command provided".to_string()),
    };

    let command_template = term_app.command_template();
    let shell_command = command_template
        .replace("{cmd}", &command)
        .replace("{app_name}", term_app.app_name());
    
    let (shell, args) = if cfg!(target_os = "windows") {
        ("cmd.exe", vec!["/C", "start", "cmd", "/K", &shell_command])
    } else {
        ("sh", vec!["-c", &shell_command])
    };
    
    Command::new(shell)
        .args(&args)
        .spawn()
        .map_err(|err| format!("Failed to execute terminal command: {}", err))?;

    Ok(format!("Opening terminal with command: '{}'", command))
}
