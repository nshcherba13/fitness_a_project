import { toast } from "react-toastify";

export const notifySuccess = (message) => {
    toast.success(message, {
        position: "top-center",
        autoClose: 3000,
        pauseOnHover: true,
        closeOnClick: true,
    });
};

export const notifyError = (message) => {
    toast.error(message, {
        position: "top-center",
        autoClose: 3000,
        pauseOnHover: true,
        closeOnClick: true,
    });
};
