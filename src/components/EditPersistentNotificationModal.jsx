import React, { useState, useEffect } from "react";
import axios from "axios";

export default function EditPersistentNotificationModal({ 
isOpen, 
onClose, 
notification, 
onUpdate 
}) {
  // فیلدهای فرم
const [formData, setFormData] = useState({
    title: "",
    message: "",
    type: "SYSTEM",
    dismissible: true,
    targetRole: "admin",
    priority: "medium"
});

  // وضعیت‌ها
const [loading, setLoading] = useState(false);
const [error, setError] = useState("");
const [success, setSuccess] = useState("");

  // آماده‌سازی داده‌ها برای ویرایش
useEffect(() => {
    if (notification) {
    setFormData({
        title: notification.title || "",
        message: notification.message || "",
        type: notification.type || "SYSTEM",
        dismissible: notification.dismissible !== undefined ? notification.dismissible : true,
        targetRole: notification.targetRole || "admin",
        priority: notification.priority || "medium"
    });
    }
}, [notification]);

  // تغییر فیلدها
const handleChange = (e) => {
    const { name, value, type: inputType, checked } = e.target;
    setFormData(prev => ({
    ...prev,
    [name]: inputType === "checkbox" ? checked : value
    }));
};

  // ارسال فرم
const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.message.trim()) {
    setError("عنوان و متن اعلان نمی‌توانند خالی باشند.");
    return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
    const token = localStorage.getItem("adminToken");
    const method = notification ? "put" : "post";
    const url = notification 
        ? `http://localhost:5000/api/admin/notifications/persistent/${notification._id}`
        : "http://localhost:5000/api/admin/notifications/persistent";
    
    const res = await axios[method](
        url,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
    );

    setSuccess("اعلان با موفقیت ذخیره شد.");
    
    if (onUpdate) {
        onUpdate(res.data.notification);
    }
    
      // پس از 1.5 ثانیه بستن مدال
    setTimeout(() => {
        onClose();
    }, 1500);

    } catch (err) {
    setError(err.response?.data?.message || "خطا در ذخیره اعلان.");
    console.error(err);
    } finally {
    setLoading(false);
    }
};

if (!isOpen) return null;

return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white p-6 rounded shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h3 className="mb-6 text-xl font-semibold">
        {notification ? "ویرایش اعلان دائمی" : "ایجاد اعلان دائمی جدید"}
        </h3>

        {/* فرم ویرایش */}
        <form onSubmit={handleSubmit}>
          {/* عنوان */}
        <div className="mb-4">
            <label className="block mb-2 text-gray-700">عنوان اعلان</label>
            <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            placeholder="عنوان جذاب و کوتاه"
            required
            />
        </div>

          {/* متن اعلان */}
        <div className="mb-4">
            <label className="block mb-2 text-gray-700">متن اعلان</label>
            <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 min-h-[100px]"
            placeholder="متن کامل اعلان..."
            required
            />
        </div>

          {/* نوع اعلان */}
        <div className="grid grid-cols-1 gap-4 mb-4 md:grid-cols-2">
            <div>
            <label className="block mb-2 text-gray-700">نوع اعلان</label>
            <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
            >
                <option value="SYSTEM">سیستم</option>
                <option value="ALERT">هشدار</option>
                <option value="INFO">اطلاع‌رسانی</option>
                <option value="PROMOTION">تبلیغاتی</option>
            </select>
            </div>

            {/* اولویت */}
            <div>
            <label className="block mb-2 text-gray-700">اولویت</label>
            <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
            >
                <option value="low">کم</option>
                <option value="medium">متوسط</option>
                <option value="high">بالا</option>
            </select>
            </div>
        </div>

          {/* تنظیمات اضافی */}
        <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-2">
            <div className="flex items-center">
            <input
                type="checkbox"
                id="dismissible"
                name="dismissible"
                checked={formData.dismissible}
                onChange={handleChange}
                className="w-4 h-4 text-blue-600"
            />
            <label htmlFor="dismissible" className="mr-2 text-gray-700">
                قابل بستن توسط کاربر
            </label>
            </div>

            <div>
            <label className="block mb-2 text-gray-700">مقصد</label>
            <select
                name="targetRole"
                value={formData.targetRole}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
            >
                <option value="admin">مدیران</option>
                <option value="editor">ویرایشگران</option>
                <option value="all">همه کاربران</option>
            </select>
            </div>
        </div>

          {/* پیام‌های وضعیت */}
        {error && (
            <div className="p-3 mb-4 text-sm text-red-700 border border-red-200 rounded bg-red-50">
            {error}
            </div>
    )}
        
        {success && (
            <div className="p-3 mb-4 text-sm text-green-700 border border-green-200 rounded bg-green-50">
            {success}
            </div>
        )}

          {/* دکمه‌ها */}
        <div className="flex justify-end space-x-4 space-x-reverse">
            <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
            >
            لغو
            </button>
            <button
            type="submit"
            disabled={loading}
            className="flex items-center px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 disabled:opacity-50"
            >
            {loading ? (
                <>
                <svg className="w-4 h-4 mr-2 -ml-1 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                در حال پردازش...
                </>
            ) : (
                "ذخیره تغییرات"
            )}
            </button>
        </div>
        </form>

        {/* پیش‌نمایش */}
        <div className="pt-6 mt-6 border-t">
        <h4 className="mb-3 font-semibold">پیش‌نمایش اعلان:</h4>
        <div className={`p-4 rounded shadow-sm ${
            formData.type === "ALERT" ? "bg-yellow-50 border-l-4 border-yellow-500" :
            formData.type === "INFO" ? "bg-blue-50 border-l-4 border-blue-500" :
            formData.type === "PROMOTION" ? "bg-purple-50 border-l-4 border-purple-500" :
            "bg-gray-50 border-l-4 border-gray-500"
        }`}>
            <div className="flex justify-between">
            <strong>{formData.title || "عنوان اعلان"}</strong>
            {formData.dismissible && (
                <button className="text-gray-500 hover:text-gray-700">
                ×
                </button>
            )}
            </div>
            <p className="mt-1 text-sm">
            {formData.message || "متن اعلان اینجا نمایش داده می‌شود."}
            </p>
            <div className="flex items-center mt-2 text-xs text-gray-500">
            <span className={`inline-block w-2 h-2 rounded-full ${
                formData.priority === "high" ? "bg-red-500" :
                formData.priority === "medium" ? "bg-yellow-500" : "bg-green-500"
            } mr-1`}></span>
            {formData.priority === "high" ? "اولویت بالا" :
            formData.priority === "medium" ? "اولویت متوسط" : "اولویت پایین"}
            </div>
        </div>
        </div>
    </div>
    </div>
);
}