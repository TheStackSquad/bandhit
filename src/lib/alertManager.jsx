//src/lib/alertManager.jsx

"use client";
import { toast, ToastContainer as ToastifyContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export { toast };

// Initialize Toast Container
export const ToastContainer = () => (
    <ToastifyContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        style={{ zIndex: 9999 }} // Set a high z-index
    />
);

// Toast Functions

export const showInfo = (message, options = {}) => {
    return toast.info(message, {
        isLoading: true,
        autoClose: false,
        closeButton: false,
        ...options
    });
};

export const showSuccess = (message, options = {}) => {
    return toast.success(message, {
        autoClose: 5000,
        ...options
    });
};

export const showError = (message, options = {}) => {
    return toast.error(message, {
        autoClose: 5000,
        ...options
    });
};

export const showWarning = (message, options = {}) => {
    return toast.warning(message, {
        autoClose: 5000,
        ...options
    });
};