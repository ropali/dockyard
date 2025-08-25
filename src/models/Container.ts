import {Docker} from '../types/docker';

export class Container implements Docker.Container {
    Id: string;
    Names: string[];
    Image: string;
    Status: string;
    State: string;
    Ports: { PublicPort: number; PrivatePort: number; }[];
    Mounts: { Name: string; }[];
    Labels: Record<string, string>;

    constructor(data: Partial<Docker.Container>) {
        this.Id = data.Id || '';
        this.Names = data.Names || [];
        this.Image = data.Image || '';
        this.Status = data.Status || '';
        this.State = data.State || '';
        this.Ports = data.Ports || [];
        this.Mounts = data.Mounts || [];
        this.Labels = data.Labels || {};
    }

    getName(): string {
        return this.Names[0].slice(1);
    }

    getImageName(): string {
        return this.Image.split(':')[0];
    }

    isRunning(): boolean {
        return this.State.toLowerCase() === 'running';
    }

    isDockerComposeContainer(): boolean {
        return this.Labels['com.docker.compose.project'] !== undefined;
    }

    getDockerComposeProject(): string | null {
        return this.Labels['com.docker.compose.project'] || null;
    }

    getDockerComposeService(): string | null {
        return this.Labels['com.docker.compose.service'] || null;
    }
}


export class ContainerProcess implements Docker.ContainerProcess {
    uuid: string;
    pid: string;
    ppid: string;
    c: string;
    tty: string;
    time: string;
    cmd: string;

    constructor(data: Partial<Docker.ContainerProcess>) {
        this.uuid = data.uuid || '';
        this.pid = data.pid || '';
        this.ppid = data.ppid || '';
        this.c = data.c || '';
        this.tty = data.tty || '';
        this.time = data.time || '';
        this.cmd = data.cmd || '';
    }
}