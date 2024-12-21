import toast from "./toast";

export const copyToClipboard = (text: string): Promise<void> => {
    return navigator.clipboard.writeText(text).then(() => {
        toast.success('Copied to clipboard!');
    }).catch((_: Error) => {
        toast.error('Failed to copy');
    });
};