import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import '@sweetalert2/theme-dark/dark.css';

type ToastType = 'success' | 'error' | 'warning' | 'info';
type ToastLibrary = 'sweetalert2' | 'react-toast';

interface TimerProgressColors {
    [key: string]: string;
}

const toast = (() => {
    let currentLibrary: ToastLibrary = 'sweetalert2';

    const showToast = (message: string, type: ToastType = 'info', duration: number = 3000): void => {
        const timerProgressColors: TimerProgressColors = {
            success: "bg-success",
            info: "bg-info", 
            warning: "bg-warning",
            error: "bg-error"
        };
        if (currentLibrary === 'sweetalert2') {
            Swal.fire({
                toast: true,
                position: 'bottom-right',
                showConfirmButton: false,
                timer: duration,
                timerProgressBar: true,
                icon: type,
                background: 'oklch(var(--b2))',
                html: `<span class="text-base-content">${message}</span>`,
                customClass: {
                    popup: 'toast-popup',
                    timerProgressBar: timerProgressColors[type]
                },
                didOpen: (toast) => {
                    // Thi s is the workaround to change the text color
                    // on Windows system as the text color was not working
                    // properly for light themes
                    const toastContent = toast.querySelector('.swal2-html-container');
                    if (toastContent) {
                        toastContent.style.color = 'inherit';
                    }
                }
            })
        } else if (currentLibrary === 'react-toast') {
            console.log(`React-toast: ${type} - ${message}`);
        }
    };

    const setLibrary = (library: ToastLibrary): void => {
        if (['sweetalert2', 'react-toast'].includes(library)) {
            currentLibrary = library;
        } else {
            console.error('Unsupported library');
        }
    };

    return {
        success: (message: string, duration?: number) => showToast(message, 'success', duration),
        error: (message: string, duration?: number) => showToast(message, 'error', duration),
        warning: (message: string, duration?: number) => showToast(message, 'warning', duration),
        info: (message: string, duration?: number) => showToast(message, 'info', duration),
        setLibrary
    };
})();

export default toast;
