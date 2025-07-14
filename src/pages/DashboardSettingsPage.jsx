import React, { useState } from "react";

export default function DashboardSettingsPage() {
const [settings, setSettings] = useState({
    showUserChart: true,
    showOrderChart: true,
    showProductChart: true,
    theme: "light",
    itemsPerPage: 5,
    chartType: "bar", // bar, pie, line
});

const handleSettingChange = (key, value) => {
    setSettings((prev) => ({
    ...prev,
    [key]: value,
    }));
};

const saveSettings = () => {
    localStorage.setItem("dashboardSettings", JSON.stringify(settings));
    alert("تنظیمات ذخیره شد.");
};

return (
    <div className="container py-10 mx-auto">
    <h2 className="mb-6 text-3xl font-bold">تنظیمات داشبورد</h2>

      {/* نمایش نمودارها */}
    <div className="p-6 mb-6 bg-white rounded shadow">
        <h3 className="mb-4 text-xl font-semibold">نمایش نمودارها</h3>
        <div className="space-y-4">
        <label className="flex items-center space-x-2 space-x-reverse">
            <input
            type="checkbox"
            checked={settings.showUserChart}
            onChange={(e) =>
                handleSettingChange("showUserChart", e.target.checked)
            }
            />
            <span>نمودار کاربران</span>
        </label>

        <label className="flex items-center space-x-2 space-x-reverse">
            <input
            type="checkbox"
            checked={settings.showOrderChart}
            onChange={(e) =>
                handleSettingChange("showOrderChart", e.target.checked)
            }
            />
            <span>نمودار سفارشات</span>
        </label>

        <label className="flex items-center space-x-2 space-x-reverse">
            <input
            type="checkbox"
            checked={settings.showProductChart}
            onChange={(e) =>
                handleSettingChange("showProductChart", e.target.checked)
            }
            />
            <span>نمودار محصولات</span>
        </label>
        </div>
    </div>

      {/* تعداد آیتم در هر صفحه */}
    <div className="p-6 mb-6 bg-white rounded shadow">
        <h3 className="mb-4 text-xl font-semibold">تعداد آیتم‌ها</h3>
        <div className="mb-4">
        <label className="block mb-2 text-gray-700">تعداد آیتم در هر صفحه</label>
        <select
            value={settings.itemsPerPage}
            onChange={(e) =>
            handleSettingChange("itemsPerPage", parseInt(e.target.value))
            }
            className="w-full px-3 py-2 border rounded"
        >
            <option value={5}>۵ عدد</option>
            <option value={10}>۱۰ عدد</option>
            <option value={20}>۲۰ عدد</option>
        </select>
        </div>
    </div>

      {/* نوع نمودارها */}
    <div className="p-6 mb-6 bg-white rounded shadow">
        <h3 className="mb-4 text-xl font-semibold">نوع نمودارها</h3>
        <div className="grid grid-cols-3 gap-4">
        <label className="flex flex-col items-center cursor-pointer">
            <input
            type="radio"
            name="chartType"
            value="bar"
            checked={settings.chartType === "bar"}
            onChange={() => handleSettingChange("chartType", "bar")}
            className="mb-2"
            />
            <span>ستونی</span>
        </label>
        <label className="flex flex-col items-center cursor-pointer">
            <input
            type="radio"
            name="chartType"
            value="pie"
            checked={settings.chartType === "pie"}
            onChange={() => handleSettingChange("chartType", "pie")}
            className="mb-2"
            />
            <span>دایره‌ای</span>
        </label>
        <label className="flex flex-col items-center cursor-pointer">
            <input
            type="radio"
            name="chartType"
            value="line"
            checked={settings.chartType === "line"}
            onChange={() => handleSettingChange("chartType", "line")}
            className="mb-2"
            />
            <span>خطی</span>
        </label>
        </div>
    </div>

      {/* تم رابط کاربری */}
    <div className="p-6 mb-6 bg-white rounded shadow">
        <h3 className="mb-4 text-xl font-semibold">پوسته (Theme)</h3>
        <select
        value={settings.theme}
        onChange={(e) => handleSettingChange("theme", e.target.value)}
        className="w-full px-3 py-2 border rounded"
        >
        <option value="light">روشن</option>
        <option value="dark">تاریک</option>
        <option value="blue">آبی</option>
        <option value="green">سبز</option>
        </select>
    </div>

      {/* دکمه ذخیره */}
    <button
        onClick={saveSettings}
        className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
    >
        ذخیره تنظیمات
    </button>
    </div>
);
}