export { copyToClipboard } from "./clipboard";

export const formatSize = (size: number): string => {
    const sizeInMB = size / 1024 / 1024;
    return sizeInMB.toFixed(2) + ' MB';
};

export const formatDate = (timestamp: number): string => {
    return new Date(timestamp * 1000).toLocaleString();
};

export function capitalizeFirstLetter(str: string): string {
    return str[0].toUpperCase() + str.slice(1);
}


export function debounce(func: () => Promise<void>, wait: number) {
    let timeout: NodeJS.Timeout | null = null;
    return () => {
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(() => {
            func();
        }, wait);
    };
}
