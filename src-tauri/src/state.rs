use std::sync::{atomic::AtomicBool, Arc};

use bollard::Docker;

pub struct AppState {
    pub docker: Docker,
    pub cancel_stats: Arc<AtomicBool>,
    pub cancel_logs: Arc<AtomicBool>,
}

impl AppState {
    pub fn default() -> Self {
        let docker = match Docker::connect_with_defaults() {
            Ok(docker) => docker,
            Err(e) => {
                panic!("Failed To Connect: {}", e);
            }
        };
        AppState {
            docker,
            cancel_stats: Arc::new(AtomicBool::new(false)),
            cancel_logs: Arc::new(AtomicBool::new(false))
        }
    }
}