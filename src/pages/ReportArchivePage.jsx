import React, { useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns-jalali"; // برای تاریخ شمسی
import AddTagsModal from "../components/AddTagsModal";
import TagCloud from "../components/TagCloud";
export default function ReportArchivePage() {
    const [allTags, setAllTags] = useState([]);
const [reports, setReports] = useState([]);
const [loading, setLoading] = useState(true);
const [filters, setFilters] = useState({
searchTerm: "",
startDate: "",
endDate: "",
format: "",
tag: "",
});
const [showTagModal, setShowTagModal] = useState(false);
const [selectedReport, setSelectedReport] = useState(null);
// const allTags = reports.flatMap((r) => r.tags || []);

const handleUpdateTags = (updatedReport) => {
    setReports(reports.map((r) => (r._id === updatedReport._id ? updatedReport : r)));
};

const filteredReports = reports.filter((r) => {
const matchesSearch = !filters.searchTerm || 
    r.name?.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
    r.title?.toLowerCase().includes(filters.searchTerm.toLowerCase());

const matchesTag = !filters.tag || (r.tags || []).includes(filters.tag);

return matchesSearch && matchesTag;
});

const [availableTags, setAvailableTags] = useState(["مالی", "عملیات", "امنیت", "هفتگی", "ماهانه"]);


useEffect(() => {
    const fetchArchive = async () => {
    try {
        const token = localStorage.getItem("adminToken");
        const params = new URLSearchParams();

        if (filters.searchTerm) params.append("search", filters.searchTerm);
        if (filters.startDate) params.append("startDate", filters.startDate);
        if (filters.endDate) params.append("endDate", filters.endDate);
        if (filters.format) params.append("format", filters.format);

        const res = await axios.get(`http://localhost:5000/api/admin/reports/archive?${params}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        });

        setReports(res.data.data || []);
    } catch (err) {
        console.error(err);
    } finally {
        setLoading(false);
    }
    };

    fetchArchive();
}, [filters, setFilters, setReports, setLoading]);

const handleDelete = async (id) => {
    if (!window.confirm("آیا مطمئن هستید؟ این عمل غیرقابل بازگشت است.")) return;

    try {
    const token = localStorage.getItem("adminToken");
    await axios.delete(`http://localhost:5000/api/admin/reports/archive/${id}`, {
        headers: {
        Authorization: `Bearer ${token}`,
        },
    });
    setReports(reports.filter((r) => r._id !== id));
    alert("گزارش با موفقیت حذف شد.");
    } catch (err) {
    alert("خطا در حذف گزارش.");
    console.error(err);
    }
};

  // فیلتر داده‌ها
useEffect(() => {
const fetchPopularTags = async () => {
    try {
    const token = localStorage.getItem("adminToken");
    const res = await axios.get("http://localhost:5000/api/admin/reports/tags/popular", {
        headers: { Authorization: `Bearer ${token}` },
    });
    setAllTags(res.data.tags);
    } catch (err) {
    console.error(err);
    }
};

fetchPopularTags();
}, [ setAllTags, setReports, setLoading, setFilters, setSelectedReport, setShowTagModal]);



return (
    <div className="container py-10 mx-auto">
    <h2 className="mb-6 text-3xl font-bold">آرشیو گزارش‌ها</h2>

      {/* فیلترها */}
    <div className="grid grid-cols-1 gap-4 p-6 mb-6 bg-white rounded shadow md:grid-cols-5">
        <div>
        <label className="block mb-2 text-gray-700">جستجو</label>
        <input
            type="text"
            value={filters.searchTerm}
            onChange={(e) => setFilters((prev) => ({ ...prev, searchTerm: e.target.value }))}
            placeholder="نام یا عنوان"
            className="w-full px-3 py-2 border rounded"
        />
        </div>
        <div>
        <label className="block mb-2 text-gray-700">از تاریخ</label>
        <input
            type="date"
            value={filters.startDate}
            onChange={(e) => setFilters((prev) => ({ ...prev, startDate: e.target.value }))}
            className="w-full px-3 py-2 border rounded"
        />
        </div>
        <div>
        <label className="block mb-2 text-gray-700">تا تاریخ</label>
        <input
            type="date"
            value={filters.endDate}
            onChange={(e) => setFilters((prev) => ({ ...prev, endDate: e.target.value }))}
            className="w-full px-3 py-2 border rounded"
        />
        </div>
        <div>
        <label className="block mb-2 text-gray-700">فرمت</label>
        <select
            value={filters.format}
            onChange={(e) => setFilters((prev) => ({ ...prev, format: e.target.value }))}
            className="w-full px-3 py-2 border rounded"
        >
            <option value="">همه</option>
            <option value="pdf">PDF</option>
            <option value="excel">Excel</option>
        </select>
        </div>
        <div className="flex items-end">
        <button
            onClick={() => setFilters({ searchTerm: "", startDate: "", endDate: "", format: "" })}
            className="w-full px-4 py-2 text-white bg-gray-500 rounded hover:bg-gray-600"
        >
            پاک کردن
        </button>
        </div>
    </div>

    <TagCloud 
tags={allTags} 
onTagClick={(tag) => setFilters((prev) => ({ ...prev, tag }))} 
title="ابِر تگ گزارش‌ها" 
/>

      {/* لیست گزارش‌ها */}
    <div className="overflow-hidden bg-white rounded shadow">
        {loading ? (
        <p className="p-6 text-center">در حال بارگذاری...</p>
        ) : filteredReports.length === 0 ? (
        <p className="p-6 text-center text-gray-500">هیچ گزارشی در آرشیو وجود ندارد.</p>
        ) : (
        <table className="min-w-full">
            <thead className="bg-gray-100">
            <tr>
                <th className="px-4 py-2 text-left border-b">عنوان</th>
                <th className="px-4 py-2 text-left border-b">نوع</th>
                <th className="px-4 py-2 text-left border-b">تاریخ</th>
                <th className="px-4 py-2 text-left border-b">اندازه</th>
                <th className="px-4 py-2 text-left border-b">عملیات</th>
            </tr>
            </thead>
            <tbody>
            {filteredReports.map((r) => (
                <tr key={r._id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border-b">
                    <div>
                    <strong>{r.title || r.name || "گزارش بدون عنوان"}</strong>
                    <p className="text-sm text-gray-500">{r.templateName || "بدون قالب"}</p>
                    </div>
                </td>
                <td className="px-4 py-2 border-b">
                    <span
                    className={`inline-block px-2 py-1 rounded text-xs ${
                        r.format === "pdf"
                        ? "bg-red-100 text-red-800"
                        : "bg-green-100 text-green-800"
                    }`}
                    >
                    {r.format.toUpperCase()}
                    </span>
                </td>
                <td className="px-4 py-2 border-b">
                    {format(new Date(r.createdAt), "yyyy/MM/dd HH:mm")}
                </td>
                <td className="px-4 py-2 border-b">{formatFileSize(r.fileSize)}</td>
            <td className="flex px-4 py-2 space-x-2 space-x-reverse border-b">
            <a href={r.fileUrl} download className="text-blue-500 hover:underline">
                دانلود
            </a>
            <button
                onClick={() => {
                setSelectedReport(r);
                setShowTagModal(true);
                }}
                className="text-sm text-green-500 hover:underline"
            >
                ویرایش تگ‌ها
            </button>
            <button
                onClick={() => handleDelete(r._id)}
                className="text-red-500 hover:underline"
            >
                حذف
            </button>
            </td>

                <td className="px-4 py-2 border-b">
<div className="flex flex-wrap gap-1">
    {(r.tags || []).length === 0 ? (
    <span className="text-xs text-gray-400">بدون تگ</span>
    ) : (
    (r.tags || []).map((tag) => (
        <span
        key={tag}
        className="px-2 py-1 text-xs text-blue-800 bg-blue-100 rounded"
        >
        {tag}
        </span>
    ))
    )}
</div>
</td>
                
                </tr>
            ))}
            </tbody>

  {/* مدال */}
    <AddTagsModal
        isOpen={showTagModal}
        onClose={() => setShowTagModal(false)}
        report={selectedReport}
        onUpdate={handleUpdateTags}
    />
            
        </table>
        )}
    </div>

{/* فیلتر تگ */}
<div>
<label className="block mb-2 text-gray-700">تگ</label>
<select
    value={filters.tag}
    onChange={(e) => setFilters((prev) => ({ ...prev, tag: e.target.value }))}
    className="w-full px-3 py-2 border rounded"
>
    <option value="">همه تگ‌ها</option>
    {availableTags.map((tag) => (
    <option key={tag} value={tag}>
        {tag}
    </option>
    ))}
</select>
</div>

      {/* آمار */}
    <div className="grid grid-cols-1 gap-6 mt-8 md:grid-cols-4">
        <StatCard title="کل گزارش‌ها" value={filteredReports.length} color="bg-blue-500" />
        <StatCard title="PDF" value={filteredReports.filter(r => r.format === "pdf").length} color="bg-red-500" />
        <StatCard title="Excel" value={filteredReports.filter(r => r.format === "excel").length} color="bg-green-500" />
        <StatCard title="امروز" value={filteredReports.filter(r => isToday(r.createdAt)).length} color="bg-purple-500" />
    </div>
    </div>
);
}

// توابع کمکی
function formatFileSize(bytes) {
if (bytes === 0) return "0 بایت";
const k = 1024;
const sizes = ["بایت", "کیلوبایت", "مگابایت", "گیگابایت"];
const i = Math.floor(Math.log(bytes) / Math.log(k));
return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

function isToday(date) {
const d = new Date(date);
const today = new Date();
return (
    d.getFullYear() === today.getFullYear() &&
    d.getMonth() === today.getMonth() &&
    d.getDate() === today.getDate()
);
}

function StatCard({ title, value, color }) {
return (
    <div className={`p-6 rounded shadow text-white ${color}`}>
    <h3 className="text-lg">{title}</h3>
    <p className="mt-2 text-xl font-bold">{value}</p>
    </div>
);
}