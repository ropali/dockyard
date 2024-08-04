extern crate rust_dock;

use rust_dock::container::{Container, ContainerInfo};
use rust_dock::image::{Image, ImageHistory};
use rust_dock::version::Version;
use rust_dock::Docker;
use serde_json::Value;

pub trait ContainerState {
    fn state(&self) -> String;
}

impl ContainerState for Container {
    fn state(&self) -> String {
        // Calculate state from Status
        match self.Status.as_str() {
            "running" => "Active".to_string(),
            "exited" => "Inactive".to_string(),
            _ => "Unknown".to_string(),
        }
    }
}

pub fn get_docker() -> Docker {
    let docker = match Docker::connect("unix:///var/run/docker.sock") {
        Ok(docker) => docker,
        Err(e) => {
            panic!("{}", e);
        }
    };

    return docker;
}

pub fn get_containers() -> Vec<Container> {
    let mut docker = get_docker();

    let containers = match docker.get_containers(true) {
        Ok(containers) => containers,
        Err(e) => {
            panic!("{}", e);
        }
    };

    return containers;
}

pub fn get_container_info(c: &Container) -> serde_json::Value {
    let mut docker = get_docker();

    match docker.get_container_info_raw(c) {
        Ok(info) => info,
        Err(e) => {
            panic!("{}", e)
        }
    }
}

pub fn get_images() -> Vec<Image> {
    let mut docker = get_docker();

    let images = match docker.get_images(false) {
        Ok(images) => images,
        Err(_) => {
            panic!("Can't get images");
        }
    };

    return images;
}

pub fn inspect_image(name: &str) -> Value {
    let mut docker = get_docker();

    let inspect_value = match docker.inspect_image(name) {
        Ok(inspect_value) => inspect_value,
        Err(_) => {
            panic!("Can't get images");
        }
    };

    return inspect_value;
}

pub fn image_history(name: &str) -> Vec<ImageHistory> {
    let mut docker = get_docker();

    let inspect_value = match docker.image_history(name) {
        Ok(inspect_value) => inspect_value,
        Err(_) => {
            panic!("Can't get images");
        }
    };

    return inspect_value;
}

pub fn delete_image(id: &str, force: bool, no_prune: bool) -> String {
    let mut docker = get_docker();

    let result = match docker.delete_image(&id, force, no_prune) {
        Ok(_) => format!("Image deleted."),
        Err(err) => format!("Failed: {}", err.to_string()),
    };

    return result;
}

pub fn get_version() -> Version {
    let mut docker = get_docker();
    let version = match docker.get_version() {
        Ok(version) => version,
        Err(e) => {
            panic!("{}", e)
        }
    };

    return version;
}
