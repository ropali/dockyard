import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import '@sweetalert2/theme-dark/dark.css';

const toast = (() => {
    let currentLibrary = 'sweetalert2';


    const showToast = (message, type = 'info', duration = 3000) => {
        if (currentLibrary === 'sweetalert2') {
            Swal.fire({
                toast: true,
                position: 'bottom-right',
                showConfirmButton: false,
                timer: duration,
                timerProgressBar: true,
                icon: type,
                title: message,
                background: 'oklch(var(--b2))',
                customClass: {
                    popup: 'text-base-content',
                    timerProgressBar: 'bg-accent'
                },
            });
        } else if (currentLibrary === 'react-toast') {
            console.log(`React-toast: ${type} - ${message}`);
        }
    };

    const setLibrary = (library) => {
        if (['sweetalert2', 'react-toast'].includes(library)) {
            currentLibrary = library;
        } else {
            console.error('Unsupported library');
        }
    };

    return {
        success: (message, duration) => showToast(message, 'success', duration),
        error: (message, duration) => showToast(message, 'error', duration),
        warning: (message, duration) => showToast(message, 'warning', duration),
        info: (message, duration) => showToast(message, 'info', duration),
        setLibrary
    };
})();

export default toast;
