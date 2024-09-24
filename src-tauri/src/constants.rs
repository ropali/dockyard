pub const STORAGE_NAME: &str = "store.bin";
pub const DOCKER_TERMINAL: &str = "docker_terminal";

pub const TERMINAL_COMMAND_TEMPLATE: &str = "tell application \"Terminal\" to do script \"{}\"";
pub const ITERM_COMMAND_TEMPLATE: &str = "tell application \"iTerm\"\n\
                                          tell current session of current window to write text \"{}\"\n\
                                          end tell";

macro_rules! define_terminals {
    ($($name:ident => $str:expr, $prefix:expr, $template:expr),*) => {
        #[derive(Debug, Clone, Copy)]
        pub enum Terminal {
            $($name),*
        }

        impl Terminal {
            pub fn as_str(&self) -> &'static str {
                match self {
                    $(Terminal::$name => $str),*
                }
            }

            pub fn command_prefix(&self) -> &'static str {
                match self {
                    $(Terminal::$name => $prefix),*
                }
            }

            pub fn command_template(&self) -> Option<&'static str> {
                match self {
                    $(Terminal::$name => $template),*
                }
            }

            pub fn from_str(s: &str) -> Option<Self> {
                match s {
                    $($str => Some(Terminal::$name)),*,
                    _ => None,
                }
            }

            pub fn variants() -> &'static [Terminal] {
                &[
                    $(Terminal::$name),*
                ]
            }
        }

        impl Default for Terminal {
            fn default() -> Self {
                if cfg!(target_os = "windows") {
                    Terminal::Cmd
                } else if cfg!(target_os = "macos") {
                    Terminal::Terminal
                } else {
                    Terminal::GnomeTerminal
                }
            }
        }
    };
}

define_terminals!(
    GnomeTerminal => "gnome-terminal", "--", None,
    Konsole => "konsole", "-e", None,
    Alacritty => "alacritty", "-e", None,
    Xterm => "xterm", "-e", None,
    Terminator => "terminator", "-x", None,
    Xfce4Terminal => "xfce4-terminal", "-e", None,
    Cmd => "cmd.exe", "/C", None,
    Powershell => "powershell.exe", "-Command", None,
    Terminal => "Terminal", "-e", Some(crate::constants::TERMINAL_COMMAND_TEMPLATE),
    ITerm => "iTerm", "-e", Some(crate::constants::ITERM_COMMAND_TEMPLATE),
    WezTerm => "wezterm", "start", None
);
