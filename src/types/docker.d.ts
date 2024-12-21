export declare namespace Docker {
    export interface Container {
        Id: string;
        Names: string[];
        Image: string;
        Status: string;
        State: string;
        Ports: {
            PublicPort: number;
            PrivatePort: number;
        }[];
        Mounts: {
            Name: string;
        }[];

        getName(): string;

        isRunning(): boolean;

    }

    export interface ContainerProcess {
        uuid: string;
        pid: string;
        ppid: string;
        c: string;
        tty: string;
        time: string;
        cmd: string;
    }

    export interface Image {
        Id: string;
        Tag: string;
        Created: string;
        Size: number;
        RepoTags: string[];

        getName(): string;

        getShortId(): string;
    }

    interface ImageHistory {
        Created: number;
        CreatedBy: string;
        Size: number;
        Tags?: string[];
    }

    export interface Volume {
        Name: string;
        Driver: string;
        Mountpoint: string;
        CreatedAt: string;
        Labels: Record<string, string>;
        Scope: string;
        Options: Record<string, string>;
    }

    export interface Network {
        Id: string;
        Name: string;
    }


}
