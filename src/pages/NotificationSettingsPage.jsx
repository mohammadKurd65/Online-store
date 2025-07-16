import React, { useState, useEffect } from "react";
import axios from "axios";

export default function NotificationSettingsPage() {
const [settings, setSettings] = useState({
    enableEmail: true,
    enablePush: true,
    enableSound: false,
    theme: "light",
    actionTypes: {
    info: true,
    warning: true,
    success: true,
    danger: true,
    },
});

const handleChange = (e) => {
    const { name, value, checked, type } = e.target;

    if (type === "checkbox") {
    if (name in settings) {
        setSettings((prev) => ({
        ...prev,
        [name]: checked,
        }));
    } else {
        // اگر زیرشیء مثل actionTypes.info
        setSettings((prev) => ({
        ...prev,
        actionTypes: {
            ...prev.actionTypes,
            [name]: checked,
        },
        }));
    }
    } else if (name === "theme") {
    setSettings((prev) => ({
        ...prev,
        [name]: value,
    }));
    }
};

const saveSettings = async () => {
    try {
    const token = localStorage.getItem("adminToken");
    await axios.put("http://localhost:5000/api/admin/notification-settings", settings, {
        headers: {
        Authorization: `Bearer ${token}`,
        },
    });
    alert("تنظیمات اعلان ذخیره شد.");
    } catch (err) {
    alert("خطا در ذخیره تنظیمات.");
    console.error(err);
    }
};

useEffect(() => {
const savedSettings = localStorage.getItem("notificationSettings");
if (savedSettings) {
    setSettings(JSON.parse(savedSettings));
}
}, []);

useEffect(() => {
localStorage.setItem("notificationSettings", JSON.stringify(settings));
}, [settings]);

return (
    <div className="container py-10 mx-auto">
    <h2 className="mb-6 text-3xl font-bold">تنظیمات اعلان</h2>

    <div className={`bg-white p-6 rounded shadow mb-8`}>
        <h3 className="mb-4 text-xl font-semibold">روش‌های دریافت اعلان</h3>
        <div className="space-y-4">
        <label className="flex items-center space-x-2 space-x-reverse">
            <input
            type="checkbox"
            name="enableEmail"
            checked={settings.enableEmail}
            onChange={handleChange}
            className="w-5 h-5 text-blue-600 form-checkbox"
            />
            <span>دریافت اعلان از طریق ایمیل</span>
        </label>

        <label className="flex items-center space-x-2 space-x-reverse">
            <input
            type="checkbox"
            name="enablePush"
            checked={settings.enablePush}
            onChange={handleChange}
            className="w-5 h-5 text-blue-600 form-checkbox"
            />
            <span>اعلان‌های دسکتاپ (Push)</span>
        </label>

        <label className="flex items-center space-x-2 space-x-reverse">
            <input
            type="checkbox"
            name="enableSound"
            checked={settings.enableSound}
            onChange={handleChange}
            className="w-5 h-5 text-blue-600 form-checkbox"
            />
            <span>صدای اعلان</span>
        </label>
        </div>
    </div>

    <div className="p-6 mb-8 bg-white rounded shadow">
        <h3 className="mb-4 text-xl font-semibold">نمایش انواع اعلان</h3>
        <div className="space-y-4">
        <label className="flex items-center space-x-2 space-x-reverse">
            <input
            type="checkbox"
            name="info"
            checked={settings.actionTypes.info}
            onChange={handleChange}
            className="w-5 h-5 text-blue-600 form-checkbox"
            />
            <span>اعلان اطلاعاتی</span>
        </label>

        <label className="flex items-center space-x-2 space-x-reverse">
            <input
            type="checkbox"
            name="warning"
            checked={settings.actionTypes.warning}
            onChange={handleChange}
            className="w-5 h-5 text-blue-600 form-checkbox"
            />
            <span>اعلان هشدار</span>
        </label>

        <label className="flex items-center space-x-2 space-x-reverse">
            <input
            type="checkbox"
            name="success"
            checked={settings.actionTypes.success}
            onChange={handleChange}
            className="w-5 h-5 text-blue-600 form-checkbox"
            />
            <span>اعلان موفقیت</span>
        </label>

        <label className="flex items-center space-x-2 space-x-reverse">
            <input
            type="checkbox"
            name="danger"
            checked={settings.actionTypes.danger}
            onChange={handleChange}
            className="w-5 h-5 text-blue-600 form-checkbox"
            />
            <span>اعلان خطرناک</span>
        </label>
        </div>
    </div>

    <div className="p-6 mb-8 bg-white rounded shadow">
        <h3 className="mb-4 text-xl font-semibold">پوسته اعلان</h3>
        <select
        name="theme"
        value={settings.theme}
        onChange={handleChange}
        className="w-full px-3 py-2 border rounded"
        >
        <option value="light">روشن</option>
        <option value="dark">تاریک</option>
        <option value="blue">آبی</option>
        <option value="red">قرمز</option>
        </select>
    </div>

    <button
        onClick={saveSettings}
        className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
    >
        ذخیره تنظیمات
    </button>
    </div>
);
}