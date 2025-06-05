import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";

ReactDOM.createRoot(document.getElementById("root")).render(
<ToastProvider>
    <AuthProvider>
    <CartProvider>
        <App />
    </CartProvider>
    </AuthProvider>
</ToastProvider>
);