import React, { createContext, useState } from "react";
import Toast from "../components/Toast";

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
const [toast, setToast] = useState({ show: false, message: "", type: "success" });

const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
    setToast({ ...toast, show: false });
    }, 3000);
};

const value = { showToast };

return (
    <ToastContext.Provider value={value}>
    {children}
    {toast.show && <Toast message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, show: false })} />}
    </ToastContext.Provider>
);
};

export const useToast = () => React.useContext(ToastContext);