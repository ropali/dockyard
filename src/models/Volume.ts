import { Docker } from '../types/docker';

export class Volume implements Docker.Volume {
    Name: string;
    Driver: string;
    Mountpoint: string;
    CreatedAt: string;
    Labels: Record<string, string>;
    Scope: string;
    Options: Record<string, string>;

    constructor(data: Partial<Docker.Volume>) {
        this.Name = data.Name || '';
        this.Driver = data.Driver || '';
        this.Mountpoint = data.Mountpoint || '';
        this.CreatedAt = data.CreatedAt || '';
        this.Labels = data.Labels || {};
        this.Scope = data.Scope || '';
        this.Options = data.Options || {};
    }
}
