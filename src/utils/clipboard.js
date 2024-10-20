import Swal from "sweetalert2";
import {TOAST_OPTIONS_ERROR, TOAST_OPTIONS_SUCCESS} from "../constants.js";

export const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
        Swal.fire({
            text: 'Copied to clipboard!',
            ...TOAST_OPTIONS_SUCCESS
        });
    }).catch(err => {
        Swal.fire({
            text: 'Failed to copy',
            ...TOAST_OPTIONS_ERROR
        });
    });
};