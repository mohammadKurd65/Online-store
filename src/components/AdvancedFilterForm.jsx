import React from "react";

export default function AdvancedFilterForm({
role,
startDate,
endDate,
searchTerm,
onRoleChange,
onStartDateChange,
onEndDateChange,
onSearchTermChange,
}) {
return (
    <div className="p-4 mb-6 bg-white rounded shadow">
    <h3 className="mb-4 text-lg font-semibold">فیلتر پیشرفته</h3>
    <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {/* جستجو */}
        <div>
        <label className="block mb-1 text-sm text-gray-600">جستجو نام کاربری</label>
        <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchTermChange(e.target.value)}
            placeholder="نام کاربری..."
            className="w-full px-3 py-2 text-sm border rounded"
        />
        </div>

        {/* نقش */}
        <div>
        <label className="block mb-1 text-sm text-gray-600">نقش</label>
        <select
            value={role}
            onChange={(e) => onRoleChange(e.target.value)}
            className="w-full px-3 py-2 text-sm border rounded"
        >
            <option value="">همه</option>
            <option value="admin">ادمین</option>
            <option value="editor">ویرایشگر</option>
            <option value="viewer">مشاهده‌گر</option>
        </select>
        </div>

        {/* تاریخ شروع */}
        <div>
        <label className="block mb-1 text-sm text-gray-600">از تاریخ</label>
        <input
            type="date"
            value={startDate}
            onChange={(e) => onStartDateChange(e.target.value)}
            className="w-full px-3 py-2 text-sm border rounded"
        />
        </div>

        {/* تاریخ پایان */}
        <div>
        <label className="block mb-1 text-sm text-gray-600">تا تاریخ</label>
        <input
            type="date"
            value={endDate}
            onChange={(e) => onEndDateChange(e.target.value)}
            className="w-full px-3 py-2 text-sm border rounded"
        />
        </div>
        
    </div>
    </div>
);
}