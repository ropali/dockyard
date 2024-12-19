import {formatSize} from '../utils';
import {Docker} from '../types/docker';

export class Image implements Docker.Image {
    Id: string;
    Tag: string;
    Created: string;
    Size: number;
    RepoTags: string[];

    constructor(data: Partial<Docker.Image>) {
        this.Id = data.Id || '';
        this.Tag = data.Tag || '';
        this.Created = data.Created || '';
        this.Size = data.Size || 0;
        this.RepoTags = data.RepoTags || [];
    }

    

    getName(): string {
        return this.RepoTags[0];
    }

    getShortId(): string {
        return this.Id.split(':')[1].slice(0, 12);
    }
}


export class ImageHistory implements Docker.ImageHistory {
    Created: number;
    CreatedBy: string;
    Size: number;
    Tags?: string[];


    getCreatedDate(): string {
        return new Date(this.Created * 1000).toLocaleDateString();
    }

    getFormattedSize(): string {
        return formatSize(this.Size);
    }
    
}