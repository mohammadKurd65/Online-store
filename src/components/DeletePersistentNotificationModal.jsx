import React from "react";
import axios from "axios";

export default function DeletePersistentNotificationModal({ isOpen, onClose, notificationId, onConfirm }) {
if (!isOpen) return null;

const handleDelete = async () => {
    try {
    const token = localStorage.getItem("adminToken");
    await axios.delete(`http://localhost:5000/api/admin/notifications/persistent/${notificationId}`, {
        headers: {
        Authorization: `Bearer ${token}`,
        },
    });

      // فراخوانی callback بعد از حذف موفق
    if (onConfirm) {
        onConfirm(notificationId);
    }

    onClose();
    } catch (err) {
    alert("خطا در حذف اعلان.");
    console.error(err);
    }
};

return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div className="w-full max-w-md p-6 bg-white rounded shadow-lg">
        <h3 className="mb-4 text-xl font-semibold">حذف اعلان دائمی</h3>
        <p className="mb-6">آیا مطمئن هستید؟ این عمل غیرقابل بازگشت است.</p>
        <div className="flex justify-end space-x-4 space-x-reverse">
        <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
        >
            لغو
        </button>
        <button
            onClick={handleDelete}
            className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
        >
            حذف
        </button>
        </div>
    </div>
    </div>
);
}