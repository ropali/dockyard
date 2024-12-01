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

    getName(): string;

    isRunning(): boolean;

  }

  export interface Image {
    Id: string;
    Name: string;
    Tag: string;
    Created: string;
    Size: number;
    RepoTags: string[];

    getName(): string;
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
