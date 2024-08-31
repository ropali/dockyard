use std::process::Command;


// TODO: Support cross OS terminal
pub fn find_terminal() -> Option<String> {
    let terminals = [
        "gnome-terminal",
        "konsole",
        "alacritty",
        "xterm",
        "terminator",
        "xfce4-terminal",
        
    ];

    for terminal in terminals.iter() {
        if let Ok(_) = Command::new("which").arg(terminal).output() {
            return Some(terminal.to_string());
        }
    }

    None
}