import {Docker} from '../types/docker';

export class Container implements Docker.Container {
    Id: string;
    Names: string[];
    Image: string;
    Status: string;
    State: string;
    Ports: { PublicPort: number; PrivatePort: number; }[];
    Mounts: { Name: string; }[];

    constructor(data: Partial<Docker.Container>) {
        this.Id = data.Id || '';
        this.Names = data.Names || [];
        this.Image = data.Image || '';
        this.Status = data.Status || '';
        this.State = data.State || '';
        this.Ports = data.Ports || [];
        this.Mounts = data.Mounts || [];
    }

    getName(): string {
        return this.Names[0].slice(1);
    }

    isRunning(): boolean {
        return this.State.toLowerCase() === 'running';
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