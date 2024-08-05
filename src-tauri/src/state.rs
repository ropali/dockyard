use rust_dock::Docker;

pub struct AppState {
    pub docker: Docker,
}

impl AppState {
    pub fn default() -> Self {
        let docker = match Docker::connect("unix:///var/run/docker.sock") {
            Ok(docker) => docker,
            Err(e) => {
                panic!("Failed To Connect: {}", e);
            }
        };
        return AppState {
            docker
        };
    }
}