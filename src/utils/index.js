export * from "./clipboard"


export const formatSize = (size) => {
    const sizeInMB = size / 1024 / 1024;
    return sizeInMB.toFixed(2) + ' MB';
};


export const formatDate = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleString();
};