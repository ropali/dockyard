
extern crate rs_docker;

use rs_docker::container::{Container, ContainerInfo};
use rs_docker::Docker;
use rs_docker::image::Image;
use rs_docker::version::Version;


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
        Err(e) => { panic!("{}", e); }
    };

    return docker;
}

pub fn get_containers() -> Vec<Container> {
    let mut docker = get_docker();

    let containers = match docker.get_containers(true) {
        Ok(containers) => containers,
        Err(e) => { panic!("{}", e); }
    };

    return containers;
}


pub fn get_container_info(c: &Container) -> ContainerInfo {
    let mut docker = get_docker();

    match docker.get_container_info(c) {
        Ok(info) => info,
        Err(e) => { panic!("{}", e) }
    }
}

pub fn get_images() -> Vec<Image> {
    let mut docker = get_docker();

    let images = match docker.get_images(false) {
        Ok(images) => images,
        Err(_) => { panic!("Can't get images"); }
    };

    return images;
}

pub fn get_version() -> Version {
    let mut docker  = get_docker();
    let version = match docker.get_version() {
        Ok(version) => version,
        Err(e) => {panic!("{}",e)}
    };

    return version;
}

