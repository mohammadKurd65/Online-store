import React, { useState } from "react";
import axios from "axios";

export default function AddTagsModal({ isOpen, onClose, report, onUpdate }) {
const [selectedTags, setSelectedTags] = useState(report.tags || []);
const [newTag, setNewTag] = useState("");
const [availableTags, setAvailableTags] = useState([
    "مالی",
    "عملیات",
    "امنیت",
    "هفتگی",
    "ماهانه",
    "فوری",
    "آزمایشی",
    ...report.tags.filter((t) => !["مالی", "عملیات", "امنیت", "هفتگی", "ماهانه", "فوری", "آزمایشی"].includes(t)),
]);

  // افزودن تگ جدید
const handleAddNewTag = () => {
    if (!newTag.trim() || availableTags.includes(newTag.trim())) return;

    const tag = newTag.trim();
    setAvailableTags((prev) => [tag, ...prev]);
    setSelectedTags((prev) => [...prev, tag]);
    setNewTag("");
};

  // تغییر وضعیت تگ
const toggleTag = (tag) => {
    setSelectedTags((prev) =>
    prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
};

  // ذخیره تغییرات
const handleSave = async () => {
    try {
    const token = localStorage.getItem("adminToken");
    const res = await axios.put(
        `http://localhost:5000/api/admin/reports/archive/${report._id}/tags`,
        { tags: selectedTags },
        {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        }
    );

      // فراخوانی callback برای آپدیت لیست
    if (onUpdate) {
        onUpdate(res.data.updated);
    }

    onClose();
    } catch (err) {
    alert("خطا در ذخیره تگ‌ها.");
    console.error(err);
    }
};

if (!isOpen) return null;

return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div className="w-full max-w-md p-6 bg-white rounded shadow-lg">
        <h3 className="mb-4 text-xl font-semibold">ویرایش تگ‌های گزارش</h3>

        {/* فیلد افزودن تگ جدید */}
        <div className="flex mb-4 space-x-2 space-x-reverse">
        <input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            placeholder="تگ جدید"
            className="flex-1 px-3 py-2 border rounded"
            onKeyPress={(e) => e.key === "Enter" && handleAddNewTag()}
        />
        <button
            onClick={handleAddNewTag}
            className="px-3 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
        >
            +
        </button>
        </div>

        {/* لیست تگ‌ها */}
        <div className="p-3 mb-4 overflow-y-auto border rounded max-h-60">
        {availableTags.length === 0 ? (
            <p className="text-sm text-gray-500">هیچ تگی وجود ندارد.</p>
        ) : (
            <div className="space-y-2">
            {availableTags.map((tag) => (
                <label key={tag} className="flex items-center space-x-2 space-x-reverse cursor-pointer">
                <input
                    type="checkbox"
                    checked={selectedTags.includes(tag)}
                    onChange={() => toggleTag(tag)}
                    className="w-4 h-4 text-blue-600 form-checkbox"
                />
                <span className="text-sm">{tag}</span>
                </label>
            ))}
            </div>
        )}
        </div>

        {/* دکمه‌ها */}
        <div className="flex justify-end space-x-4 space-x-reverse">
        <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
        >
            لغو
        </button>
        <button
            onClick={handleSave}
            className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
        >
            ذخیره تغییرات
        </button>
        </div>
    </div>
    </div>
);
}