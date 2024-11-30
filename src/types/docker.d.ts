declare namespace Docker {
  interface ImageInfo {
    id: string;
    name: string;
    tag: string;
    created: string;
    size: number;
    // Add any other properties you use in your application
  }
}
