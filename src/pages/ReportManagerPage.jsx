import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function ReportManagerPage() {
const [reports, setReports] = useState([]);
const [scheduledReports, setScheduledReports] = useState([]);
const [loading, setLoading] = useState(true);
const navigate = useNavigate();

useEffect(() => {
    const fetchAllData = async () => {
    try {
        const token = localStorage.getItem("adminToken");
        const [reportsRes, scheduledRes] = await Promise.all([
        axios.get("http://localhost:5000/api/admin/reports/history", {
            headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("http://localhost:5000/api/admin/reports/scheduled", {
            headers: { Authorization: `Bearer ${token}` },
        }),
        ]);

        setReports(reportsRes.data.data || []);
        setScheduledReports(scheduledRes.data.data || []);
    } catch (err) {
        console.error(err);
    } finally {
        setLoading(false);
    }
    };

    fetchAllData();
}, [ setLoading, setReports, setScheduledReports, navigate]);

const handleDeleteReport = async (id) => {
    if (!window.confirm("آیا مطمئن هستید؟")) return;

    try {
    const token = localStorage.getItem("adminToken");
    await axios.delete(`http://localhost:5000/api/admin/reports/history/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    setReports(reports.filter((r) => r._id !== id));
    } catch (err) {
    alert("خطا در حذف گزارش.");
    console.error(err);
    }
};

const handleDeleteScheduled = async (id) => {
    if (!window.confirm("آیا مطمئن هستید؟")) return;

    try {
    const token = localStorage.getItem("adminToken");
    await axios.delete(`http://localhost:5000/api/admin/reports/scheduled/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    setScheduledReports(scheduledReports.filter((r) => r._id !== id));
    } catch (err) {
    alert("خطا در حذف گزارش خودکار.");
    console.error(err);
    }
};

if (loading) return <p>در حال بارگذاری...</p>;

return (
    <div className="container py-10 mx-auto">
    <h2 className="mb-6 text-3xl font-bold">مدیریت گزارش‌ها</h2>

    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* گزارش‌های ایجاد شده */}
        <div className="p-6 bg-white rounded shadow">
        <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold">گزارش‌های تولید شده</h3>
            <button
            onClick={() => navigate("/admin/reports")}
            className="text-sm text-blue-500 hover:underline"
            >
            گزارش جدید
            </button>
        </div>

        <table className="min-w-full">
            <thead className="bg-gray-100">
            <tr>
                <th className="px-4 py-2 text-left border-b">نام</th>
                <th className="px-4 py-2 text-left border-b">تاریخ</th>
                <th className="px-4 py-2 text-left border-b">عملیات</th>
            </tr>
            </thead>
            <tbody>
            {reports.length === 0 ? (
                <tr>
                <td colSpan="3" className="py-4 text-center text-gray-500">
                    هیچ گزارشی وجود ندارد.
                </td>
                </tr>
            ) : (
                reports.map((r) => (
                <tr key={r._id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 border-b">{r.name || "گزارش " + r._id}</td>
                    <td className="px-4 py-2 border-b">
                    {new Date(r.createdAt).toLocaleString("fa-IR")}
                    </td>
                    <td className="px-4 py-2 border-b">
                    <div className="space-x-2 space-x-reverse">
                        <a
                        href={r.fileUrl}
                        download
                        className="text-blue-500 hover:underline"
                        >
                        دانلود
                        </a>
                        <button
                        onClick={() => handleDeleteReport(r._id)}
                        className="text-red-500 hover:underline"
                        >
                        حذف
                        </button>
                    </div>
                    </td>
                </tr>
                ))
            )}
            </tbody>
        </table>
        </div>

        {/* گزارش‌های خودکار */}
        <div className="p-6 bg-white rounded shadow">
        <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold">گزارش‌های خودکار</h3>
            <button
            onClick={() => navigate("/admin/reports/scheduled")}
            className="text-sm text-blue-500 hover:underline"
            >
            مدیریت
            </button>
        </div>

        <table className="min-w-full">
            <thead className="bg-gray-100">
            <tr>
                <th className="px-4 py-2 text-left border-b">نام</th>
                <th className="px-4 py-2 text-left border-b">ایمیل</th>
                <th className="px-4 py-2 text-left border-b">عملیات</th>
            </tr>
            </thead>
            <tbody>
            {scheduledReports.length === 0 ? (
                <tr>
                <td colSpan="3" className="py-4 text-center text-gray-500">
                    هیچ گزارش خودکاری تنظیم نشده است.
                </td>
                </tr>
            ) : (
                scheduledReports.map((r) => (
                <tr key={r._id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 border-b">{r.name}</td>
                    <td className="px-4 py-2 border-b">{r.email}</td>
                    <td className="px-4 py-2 border-b">
                    <button
                        onClick={() => handleDeleteScheduled(r._id)}
                        className="text-red-500 hover:underline"
                    >
                        حذف
                    </button>
                    </td>
                </tr>
                ))
            )}
            </tbody>
        </table>
        </div>
    </div>

      {/* آمار کلی */}
    <div className="grid grid-cols-1 gap-6 mt-8 md:grid-cols-4">
        <StatCard title="کل گزارش‌ها" value={reports.length} color="bg-blue-500" />
        <StatCard title="گزارش‌های خودکار" value={scheduledReports.length} color="bg-indigo-500" />
        <StatCard title="هفتگی" value={scheduledReports.filter(r => r.frequency === "weekly").length} color="bg-green-500" />
        <StatCard title="ماهانه" value={scheduledReports.filter(r => r.frequency === "monthly").length} color="bg-purple-500" />
    </div>
    </div>
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