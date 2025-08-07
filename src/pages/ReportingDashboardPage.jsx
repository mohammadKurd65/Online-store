import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar, Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from "chart.js";
import { exportToPDF } from "../utils/exportToPDF";
import { exportMultiSheetExcel } from "../utils/exportMultiSheetExcel";

// ثبت کامپوننت‌های ChartJS
ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

export default function ReportingDashboardPage() {
const [logs, setLogs] = useState([]);
const [loading, setLoading] = useState(true);

  // فیلترها
const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    action: "",
    adminId: "",
});

useEffect(() => {
    const fetchLogs = async () => {
try{
        const token = localStorage.getItem("adminToken");
        const params = new URLSearchParams();

        if (filters.startDate) params.append("startDate", filters.startDate);
        if (filters.endDate) params.append("endDate", filters.endDate);
        if (filters.action) params.append("action", filters.action);
        if (filters.adminId) params.append("adminId", filters.adminId);

        const res = await axios.get(`http://localhost:5000/api/admin/notifications/logs?${params}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        });

        setLogs(res.data.logs || []);
    } catch (err) {
        console.error(err);
    } finally {
        setLoading(false);
    }
    };

    fetchLogs();
}, [filters, setFilters, setLogs, setLoading]);

  // محاسبه آمار
const summaryStats = {
    total: logs.length,
    creates: logs.filter(l => l.action === "create").length,
    updates: logs.filter(l => l.action === "update").length,
    deletes: logs.filter(l => l.action === "delete").length,
    uniqueAdmins: new Set(logs.map(l => l.admin?._id)).size,
    lastAction: logs[0]
    ? `${getActionLabel(logs[0].action)} توسط ${logs[0].admin?.username}`
    : "—",
};

  // داده‌های نمودارها
const barChartData = {
    labels: ["ایجاد", "ویرایش", "حذف"],
    datasets: [
    {
        label: "تعداد",
        data: [summaryStats.creates, summaryStats.updates, summaryStats.deletes],
        backgroundColor: ["#4CAF50", "#2196F3", "#F44336"],
    },
    ],
};

const pieChartData = {
    labels: ["ایجاد", "ویرایش", "حذف"],
    datasets: [
    {
        data: [summaryStats.creates, summaryStats.updates, summaryStats.deletes],
        backgroundColor: ["#4CAF50", "#2196F3", "#F44336"],
    },
    ],
};

return (
    <div className="container py-10 mx-auto">
    <h2 className="mb-6 text-3xl font-bold">داشبورد گزارش‌گیری</h2>

      {/* فیلترها */}
    <div className="grid grid-cols-1 gap-4 p-6 mb-6 bg-white rounded shadow md:grid-cols-4">
        <div>
        <label className="block mb-2 text-gray-700">از تاریخ</label>
        <input
            type="date"
            value={filters.startDate}
            onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
            className="w-full px-3 py-2 border rounded"
        />
        </div>
        <div>
        <label className="block mb-2 text-gray-700">تا تاریخ</label>
        <input
            type="date"
            value={filters.endDate}
            onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
            className="w-full px-3 py-2 border rounded"
        />
        </div>
        <div>
        <label className="block mb-2 text-gray-700">نوع عملیات</label>
        <select
            value={filters.action}
            onChange={(e) => setFilters(prev => ({ ...prev, action: e.target.value }))}
            className="w-full px-3 py-2 border rounded"
        >
            <option value="">همه</option>
            <option value="create">ایجاد</option>
            <option value="update">ویرایش</option>
            <option value="delete">حذف</option>
        </select>
        </div>
        <div>
        <label className="block mb-2 text-gray-700">ادمین</label>
        <select
            value={filters.adminId}
            onChange={(e) => setFilters(prev => ({ ...prev, adminId: e.target.value }))}
            className="w-full px-3 py-2 border rounded"
        >
            <option value="">همه</option>
            {/* اگر لیست ادمین‌ها داشته باشی، اینجا اضافه کن */}
        </select>
        </div>
    </div>

      {/* دکمه‌های خروجی */}
    <div className="flex justify-end mb-6 space-x-4 space-x-reverse">
        <button
        onClick={() => exportToPDF(logs, summaryStats)}
        className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
        >
        📄 خروجی PDF
        </button>
        <button
        onClick={() => exportMultiSheetExcel(logs, "گزارش_گزارش_گیری.xlsx")}
        className="px-4 py-2 text-white bg-indigo-500 rounded hover:bg-indigo-600"
        >
        📊 خروجی اکسل
        </button>
    </div>

      {/* آمار */}
    <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-5">
        <StatCard title="کل لاگ‌ها" value={summaryStats.total} color="bg-blue-500" />
        <StatCard title="ایجاد شده" value={summaryStats.creates} color="bg-green-500" />
        <StatCard title="ویرایش شده" value={summaryStats.updates} color="bg-yellow-500" />
        <StatCard title="حذف شده" value={summaryStats.deletes} color="bg-red-500" />
        <StatCard title="ادمین‌های فعال" value={summaryStats.uniqueAdmins} color="bg-purple-500" />
    </div>

      {/* نمودارها */}
    <div className="grid grid-cols-1 gap-8 mb-8 lg:grid-cols-2">
        <div className="p-6 bg-white rounded shadow">
        <h3 className="mb-4 text-xl font-semibold">نمودار ستونی</h3>
        <Bar data={barChartData} options={{ responsive: true, plugins: { legend: { position: "top" } } }} />
        </div>
        <div className="p-6 bg-white rounded shadow">
        <h3 className="mb-4 text-xl font-semibold">نمودار دایره‌ای</h3>
        <Pie data={pieChartData} options={{ responsive: true, plugins: { legend: { position: "right" } } }} />
        </div>
    </div>

      {/* آخرین لاگ‌ها */}
    <div className="p-6 bg-white rounded shadow">
        <h3 className="mb-4 text-xl font-semibold">آخرین لاگ‌ها</h3>
        <table className="min-w-full">
        <thead className="bg-gray-100">
            <tr>
            <th className="px-4 py-2 text-left border-b">عملیات</th>
            <th className="px-4 py-2 text-left border-b">ادمین</th>
            <th className="px-4 py-2 text-left border-b">زمان</th>
            </tr>
        </thead>
        <tbody>
            {logs.slice(0, 10).map((log, i) => (
            <tr key={i} className="hover:bg-gray-50">
                <td className="px-4 py-2 border-b">{getActionLabel(log.action)}</td>
                <td className="px-4 py-2 border-b">{log.admin?.username || "ناشناس"}</td>
                <td className="px-4 py-2 border-b">{new Date(log.createdAt).toLocaleString("fa-IR")}</td>
            </tr>
            ))}
        </tbody>
        </table>
    </div>
    </div>
);
}

// کامپوننت آمار
function StatCard({ title, value, color }) {
return (
    <div className={`p-6 rounded shadow text-white ${color}`}>
    <h3 className="text-lg">{title}</h3>
    <p className="mt-2 text-xl font-bold">{value}</p>
    </div>
);
}

// تابع ترجمه عملیات
function getActionLabel(action) {
const labels = {
    create: "ایجاد",
    update: "ویرایش",
    delete: "حذف",
    activate: "فعال‌سازی",
    deactivate: "غیرفعال‌سازی",
};
return labels[action] || action;
}