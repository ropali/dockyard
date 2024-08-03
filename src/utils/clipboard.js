import { toast } from "react-toastify";


export const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
        toast.success('Copied to clipboard!');
    }).catch(err => {
        toast.error('Failed to copy');
    });
};