pub const STORAGE_NAME: &str = "store.bin";
pub const DOCKER_TERMINAL: &str = "docker_terminal";

pub const MACOS_COMMAND_TEMPLATE: &str = r#"
osascript -e 'tell application "System Events"
  do shell script "open -F -n -a {app_name}"
  delay 1.0
  tell application "System Events" to tell process "{app_name}" to keystroke "{cmd}" & return
end tell'
"#;

pub const LINUX_COMMAND_TEMPLATE: &str = "{app_name} -e '{cmd}'";
pub const WINDOWS_COMMAND_TEMPLATE: &str = "{app_name} /C {cmd}";
