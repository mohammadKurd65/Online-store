import React from "react";

export default function AdvancedUserFilterForm({ filters, onFilterChange }) {
return (
    <div className="p-4 mb-6 bg-white rounded shadow">
    <h3 className="mb-4 text-lg font-semibold">فیلتر پیشرفته کاربران</h3>

      {/* جستجو */}
    <div className="mb-4">
        <label className="block mb-2 text-sm text-gray-700">جستجوی نام کاربری</label>
        <input
        type="text"
        value={filters.searchTerm || ""}
        onChange={(e) => onFilterChange({ ...filters, searchTerm: e.target.value })}
        placeholder="نام کاربری..."
        className="w-full px-3 py-2 border rounded"
        />
    </div>

      {/* نقش */}
    <div className="mb-4">
        <label className="block mb-2 text-sm text-gray-700">نقش</label>
        <select
        value={filters.role}
        onChange={(e) => onFilterChange({ ...filters, role: e.target.value })}
        className="w-full px-3 py-2 border rounded"
        >
        <option value="">همه نقش‌ها</option>
        <option value="user">کاربر عادی</option>
        <option value="editor">ویرایشگر</option>
        <option value="admin">ادمین</option>
        </select>
    </div>

      {/* وضعیت */}
    <div className="mb-4">
        <label className="block mb-2 text-sm text-gray-700">وضعیت</label>
        <select
        value={filters.status}
        onChange={(e) => onFilterChange({ ...filters, status: e.target.value })}
        className="w-full px-3 py-2 border rounded"
        >
        <option value="">همه وضعیت‌ها</option>
        <option value="active">فعال</option>
        <option value="inactive">غیرفعال</option>
        <option value="blocked">مسدود</option>
        </select>
    </div>

      {/* تاریخ شروع */}
    <div className="mb-4">
        <label className="block mb-2 text-sm text-gray-700">از تاریخ ثبت‌نام</label>
        <input
        type="date"
        value={filters.startDate || ""}
        onChange={(e) => onFilterChange({ ...filters, startDate: e.target.value })}
        className="w-full px-3 py-2 border rounded"
        />
    </div>

      {/* تاریخ پایان */}
    <div className="mb-4">
        <label className="block mb-2 text-sm text-gray-700">تا تاریخ ثبت‌نام</label>
        <input
        type="date"
        value={filters.endDate || ""}
        onChange={(e) => onFilterChange({ ...filters, endDate: e.target.value })}
        className="w-full px-3 py-2 border rounded"
        />
    </div>
    </div>
);
}