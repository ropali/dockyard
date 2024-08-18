use bollard::Docker;

pub struct AppState {
    pub docker: Docker,
}

impl AppState {
    pub fn default() -> Self {
        let docker = match Docker::connect_with_socket_defaults() {
            Ok(docker) => docker,
            Err(e) => {
                panic!("Failed To Connect: {}", e);
            }
        };
        AppState {
            docker
        }
    }
}