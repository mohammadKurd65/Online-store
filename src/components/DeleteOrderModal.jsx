import React from "react";
import { decodeToken } from "../utils/jwtDecode";
export default function DeleteOrderModal({ isOpen, onClose, onConfirm, itemName = "سفارش" }) {
if (!isOpen) return null;
const token = localStorage.getItem("userToken");
const decoded = decodeToken(token);
const userRole = decoded?.role;

if (userRole !== "admin") {
  return null; // یا یک پیام دسترسی غیرمجاز
}
return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div className="w-full max-w-md p-6 bg-white rounded shadow-lg">
        <h3 className="mb-4 text-lg font-semibold">حذف {itemName}</h3>
        <p className="mb-6">آیا مطمئن هستید؟ این عمل غیرقابل بازگشت است.</p>
        <div className="flex justify-end space-x-4 space-x-reverse">
        <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
        >
            لغو
        </button>
        <button
            onClick={onConfirm}
            className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
        >
            حذف
        </button>
        </div>
    </div>
    </div>
);
}