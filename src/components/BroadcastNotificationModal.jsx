import React, { useState } from "react";
import axios from "axios";
export default function BroadcastNotificationModal({ isOpen, onClose }) {
const [formData, setFormData] = useState({
    title: "",
    message: "",
    type: "info",
    recipient: "all", // all | specific
    adminId: "",
});

const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
    ...prev,
    [name]: value,
    }));
};

const handleSubmit = async () => {
    try {
    const token = localStorage.getItem("adminToken");
    await axios.post("http://localhost:5000/api/admin/notifications/broadcast", formData, {
        headers: {
        Authorization: `Bearer ${token}`,
        },
    });
    alert("اعلان با موفقیت ارسال شد.");
    onClose();
    } catch (err) {
    alert("خطا در ارسال اعلان.");
    console.error(err);
    }
};

if (!isOpen) return null;

return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div className="w-full max-w-md p-6 bg-white rounded shadow-lg">
        <h3 className="mb-4 text-xl font-semibold">ارسال دستی اعلان</h3>

        {/* عنوان */}
        <div className="mb-4">
        <label className="block mb-2 text-gray-700">عنوان</label>
        <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="عنوان اعلان"
            className="w-full px-3 py-2 border rounded"
        />
        </div>

        {/* پیام */}
        <div className="mb-4">
        <label className="block mb-2 text-gray-700">پیام</label>
        <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="محتوای اعلان"
            rows="3"
            className="w-full px-3 py-2 border rounded"
        ></textarea>
        </div>

        {/* نوع اعلان */}
        <div className="mb-4">
        <label className="block mb-2 text-gray-700">نوع اعلان</label>
        <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
        >
            <option value="info">اطلاعات</option>
            <option value="warning">هشدار</option>
            <option value="success">موفقیت</option>
            <option value="danger">خطرناک</option>
        </select>
        </div>

        {/* دریافت کننده */}
        <div className="mb-4">
        <label className="block mb-2 text-gray-700">دریافت کننده</label>
        <select
            name="recipient"
            value={formData.recipient}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
        >
            <option value="all">همه ادمین‌ها</option>
            <option value="specific">ادمین خاص</option>
        </select>
        </div>

        {/* ID ادمین – فقط وقتی recipient == specific */}
        {formData.recipient === "specific" && (
        <div className="mb-4">
            <label className="block mb-2 text-gray-700">شناسه ادمین</label>
            <input
            type="text"
            name="adminId"
            value={formData.adminId}
            onChange={handleChange}
            placeholder="مثل: 61a1b2c3d4e5f6"
            className="w-full px-3 py-2 border rounded"
            />
        </div>
        )}

        {/* دکمه‌ها */}
        <div className="flex justify-end space-x-4 space-x-reverse">
        <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
        >
            لغو
        </button>
        <button
            onClick={handleSubmit}
            className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
        >
            ارسال اعلان
        </button>
        </div>
    </div>
    </div>
);
}