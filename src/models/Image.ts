import { Docker } from '../types/docker';

export class Image implements Docker.Image {
    Id: string;
    Name: string;
    Tag: string;
    Created: string;
    Size: number;
    RepoTags: string[];

    constructor(data: Partial<Docker.Image>) {
        this.Id = data.Id || '';
        this.Name = data.Name || '';
        this.Tag = data.Tag || '';
        this.Created = data.Created || '';
        this.Size = data.Size || 0;
        this.RepoTags = data.RepoTags || [];
    }

    name(): string {
        return this.Name;
    }
}
