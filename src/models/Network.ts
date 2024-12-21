import { Docker } from '../types/docker';

export class Network implements Docker.Network {
    Id: string;
    Name: string;

    constructor(data: Partial<Docker.Network>) {
        this.Id = data.Id || '';
        this.Name = data.Name || '';
    }

    getShortId(): string {
        return this.Id.substring(0, 12);
    }
}
