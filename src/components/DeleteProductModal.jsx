import React from "react";

export default function DeleteProductModal({ isOpen, onClose, onConfirm, itemName = "محصول" }) {
if (!isOpen) return null;

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