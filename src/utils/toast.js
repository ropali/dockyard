import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import daisyuiColors from 'daisyui/src/theming/themes'
import '@sweetalert2/theme-dark/dark.css';

const toast = (() => {
    let currentLibrary = 'sweetalert2';


    const showToast = (message, type = 'info', duration = 3000) => {
        let colorScheme = daisyuiColors[document.documentElement.getAttribute('data-theme')]["color-scheme"]

        // Check for dark mode
        const isDarkMode = colorScheme === 'dark';

        if (currentLibrary === 'sweetalert2') {
            Swal.fire({
                toast: true,
                position: 'bottom-right',
                showConfirmButton: false,
                timer: duration,
                timerProgressBar: true,
                icon: type,
                title: message,
                background: isDarkMode
                    ? '#3b3e50'
                    : '#F0F0F0',
                customClass: {
                    popup: isDarkMode
                        ? 'bg-[#2d2d2d] text-[#f5f5f5]'  // Dark mode: Charcoal bg, light gray text
                        : 'bg-[#f7f7f7] text-[#333333]', // Light mode: Very light gray bg, dark gray text
                    timerProgressBar: isDarkMode ? 'bg-[#42a5f5]' : 'bg-[#1976d2]', // Accent color
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
