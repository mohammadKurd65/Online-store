import React from "react";

export default function Toast({ message, type = "success", onClose }) {
const bgColor = type === "success" ? "bg-green-500" : "bg-red-500";

return (
    <div className={`fixed bottom-4 left-4 ${bgColor} text-white px-6 py-3 rounded shadow-lg z-50 transition-opacity duration-300`}>
    <p>{message}</p>
    <button onClick={onClose} className="absolute text-xl font-bold text-white top-1 right-2">&times;</button>
    </div>
);
}