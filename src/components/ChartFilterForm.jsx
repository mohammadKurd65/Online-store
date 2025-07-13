import React from "react";
import { decodeToken } from "../utils/jwtDecode";

export default function ChartFilterForm({ filters, onFilterChange }) {
const { year, month } = filters;
const token = localStorage.getItem("userToken");
const decoded = decodeToken(token);
const userRole = decoded?.role;

if (userRole !== "admin") {
  return null; // یا یک پیام دسترسی غیرمجاز
}
return (
    <div className="p-4 mb-6 bg-white rounded shadow">
    <h3 className="mb-4 text-lg font-semibold">فیلتر نمودار</h3>
    
      {/* سال */}
    <div className="mb-4">
        <label className="block mb-2 text-sm text-gray-700">انتخاب سال</label>
        <select
        value={year}
        onChange={(e) => onFilterChange({ ...filters, year: e.target.value })}
        className="w-full px-3 py-2 border rounded"
        >
        <option value="">همه سال‌ها</option>
        <option value="2023">۲۰۲۳</option>
        <option value="2024">۲۰۲۴</option>
        <option value="2025">۲۰۲۵</option>
        </select>
    </div>

      {/* ماه */}
    <div className="mb-4">
        <label className="block mb-2 text-sm text-gray-700">انتخاب ماه</label>
        <select
        value={month}
        onChange={(e) => onFilterChange({ ...filters, month: e.target.value })}
        className="w-full px-3 py-2 border rounded"
        >
        <option value="">همه ماه‌ها</option>
        <option value="1">فروردین</option>
        <option value="2">اردیبهشت</option>
        <option value="3">خرداد</option>
        <option value="4">تیر</option>
        <option value="5">مرداد</option>
        <option value="6">شهریور</option>
        <option value="7">مهر</option>
        <option value="8">آبان</option>
        <option value="9">آذر</option>
        <option value="10">دی</option>
        <option value="11">بهمن</option>
        <option value="12">اسفند</option>
        </select>
    </div>
    </div>
);
}