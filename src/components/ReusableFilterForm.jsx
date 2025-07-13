import React from "react";
import { getStatusLabel } from "../utils/statusManager";
import { decodeToken } from "../utils/jwtDecode";

export default function ReusableFilterForm({
filters,
onFilterChange,
showRole = false,
showDateRange = false,
showSearchTerm = true,
showStatus= true
}) {
const { role, startDate, endDate, searchTerm } = filters;
const token = localStorage.getItem("userToken");
const decoded = decodeToken(token);
const userRole = decoded?.role;

if (userRole !== "admin") {
  return null; // یا یک پیام دسترسی غیرمجاز
}
return (
    <div className="p-4 mb-6 bg-white rounded shadow">
    <h3 className="mb-4 text-lg font-semibold">فیلتر داده‌ها</h3>
    <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {/* جستجو */}
        {showSearchTerm && (
        <div>
            <label className="block mb-1 text-sm text-gray-600">جستجو</label>
            <input
            type="text"
            value={searchTerm || ""}
            onChange={(e) => onFilterChange({ ...filters, searchTerm: e.target.value })}
            placeholder="نام کاربری / شناسه..."
            className="w-full px-3 py-2 text-sm border rounded"
            />
        </div>
        )}

        {/* نقش */}
        {showRole && (
        <div>
            <label className="block mb-1 text-sm text-gray-600">نقش</label>
            <select
            value={role || ""}
            onChange={(e) =>
                onFilterChange({ ...filters, role: e.target.value })
            }
            className="w-full px-3 py-2 text-sm border rounded"
            >
            <option value="">همه</option>
            <option value="admin">ادمین</option>
            <option value="editor">ویرایشگر</option>
            <option value="viewer">مشاهده‌گر</option>
            </select>
        </div>
        )}

        {/* تاریخ شروع */}
        {showDateRange && (
        <div>
            <label className="block mb-1 text-sm text-gray-600">از تاریخ</label>
            <input
            type="date"
            value={startDate || ""}
            onChange={(e) =>
                onFilterChange({ ...filters, startDate: e.target.value })
            }
            className="w-full px-3 py-2 text-sm border rounded"
            />
        </div>
        )}

        {/* تاریخ پایان */}
        {showDateRange && (
        <div>
            <label className="block mb-1 text-sm text-gray-600">تا تاریخ</label>
            <input
            type="date"
            value={endDate || ""}
            onChange={(e) =>
                onFilterChange({ ...filters, endDate: e.target.value })
            }
            className="w-full px-3 py-2 text-sm border rounded"
            />
        </div>
        )}

        {showStatus && (
<div>
    <label className="block mb-1 text-sm text-gray-600">وضعیت سفارش</label>
    <select
    value={filters.status || ""}
    onChange={(e) =>
        onFilterChange({ ...filters, status: e.target.value })
    }
    className="w-full px-3 py-2 text-sm border rounded"
    >
    <option value="">همه</option>
    {["pending", "paid", "failed", "canceled"].map((status) => (
        <option key={status} value={status}>
        {getStatusLabel(status, "orderStatuses")}
        </option>
    ))}
    </select>
</div>
)}
    </div>
    </div>
);
}