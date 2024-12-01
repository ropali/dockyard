import { Docker } from '../types/docker';

export class Container implements Docker.Container {
    Id: string;
    Names: string[];
    Image: string;
    Status: string;
    State: string;
    Ports: { PublicPort: number; PrivatePort: number; }[];

    constructor(data: Partial<Docker.Container>) {
        this.Id = data.Id || '';
        this.Names = data.Names || [];
        this.Image = data.Image || '';
        this.Status = data.Status || '';
        this.State = data.State || '';
    }

    getName(): string {
        return this.Names[0].slice(1);
    }

    isRunning(): boolean {
        return this.State.toLowerCase() === 'running';
    }
}
