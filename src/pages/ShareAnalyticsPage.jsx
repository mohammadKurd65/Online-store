import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar, Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from "chart.js";
import RealtimeAnalyticsWidget from "../components/RealtimeAnalyticsWidget";
import LiveMapWidget from "../components/LiveMapWidget";
import LiveHeatmapWidget from "../components/LiveHeatmapWidget";
ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);
export default function ShareAnalyticsPage({ token }) {
const [data, setData] = useState(null);
const [loading, setLoading] = useState(true);

useEffect(() => {
    const fetchAnalytics = async () => {
    try {
        const token = localStorage.getItem("adminToken");
        const res = await axios.get(
        `http://localhost:5000/api/admin/reports/share-analytics/${token}`,
        {
            headers: { Authorization: `Bearer ${token}` },
        }
        );
        setData(res.data);
    } catch (err) {
        console.error(err);
    } finally {
        setLoading(false);
    }
    };

    fetchAnalytics();
}, [token, setData, setLoading]);

if (loading) return <p>در حال بارگذاری آمار...</p>;
if (!data) return <p>داده‌ای یافت نشد.</p>;

const { stats, logs } = data;

  // نمودار دستگاه‌ها
const deviceData = {
    labels: Object.keys(stats.devices),
    datasets: [{
    data: Object.values(stats.devices),
    backgroundColor: ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"],
    }]
};

  // نمودار مرورگرها
const browserData = {
    labels: Object.keys(stats.browsers).slice(0, 5),
    datasets: [{
    data: Object.values(stats.browsers).slice(0, 5),
    backgroundColor: ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"],
    }]
};

return (
    <div className="container py-10 mx-auto">
    <h2 className="mb-6 text-3xl font-bold">آمار اشتراک لینک</h2>

      {/* آمار کلی */}
    <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-5">
        <StatCard title="کل بازدیدها" value={stats.totalViews} color="bg-blue-500" />
        <StatCard title="بازدیدکنندگان منحصربفرد" value={stats.uniqueVisitors} color="bg-green-500" />
        <StatCard title="اولین بازدید" value={formatDate(stats.firstView)} color="bg-gray-500" />
        <StatCard title="آخرین بازدید" value={formatDate(stats.lastView)} color="bg-purple-500" />
        <StatCard title="تعداد روز" value={Math.ceil((stats.lastView - stats.firstView) / (1000 * 60 * 60 * 24)) || 1} color="bg-indigo-500" />
    </div>

      {/* نمودارها */}
    <div className="grid grid-cols-1 gap-8 mb-8 lg:grid-cols-2">
        <div className="p-6 bg-white rounded shadow">
        <h3 className="mb-4 text-xl font-semibold">دستگاه‌های بازدیدکننده</h3>
        <Pie data={deviceData} options={{ responsive: true, plugins: { legend: { position: "right" } } }} />
        </div>
        <div className="p-6 bg-white rounded shadow">
        <h3 className="mb-4 text-xl font-semibold">مرورگرهای استفاده شده</h3>
        <Bar data={browserData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
        </div>
    </div>

      {/* لیست بازدیدها */}
    <div className="p-6 bg-white rounded shadow">
        <h3 className="mb-4 text-xl font-semibold">تاریخچه بازدیدها</h3>
        <table className="min-w-full">
        <thead className="bg-gray-100">
            <tr>
            <th className="px-4 py-2 text-left border-b">زمان</th>
            <th className="px-4 py-2 text-left border-b">IP</th>
            <th className="px-4 py-2 text-left border-b">دستگاه</th>
            <th className="px-4 py-2 text-left border-b">مرورگر</th>
            <th className="px-4 py-2 text-left border-b">سیستم عامل</th>
            </tr>
        </thead>
        <tbody>
            {logs.length === 0 ? (
            <tr>
                <td colSpan="5" className="py-4 text-center text-gray-500">
                هیچ بازدیدی ثبت نشده است.
                </td>
            </tr>
            ) : (
            logs.map((log, i) => (
                <tr key={i} className="hover:bg-gray-50">
                <td className="px-4 py-2 border-b">{new Date(log.viewedAt).toLocaleString("fa-IR")}</td>
                <td className="px-4 py-2 border-b">{log.ip}</td>
                <td className="px-4 py-2 border-b">{log.device}</td>
                <td className="px-4 py-2 border-b">{log.browser}</td>
                <td className="px-4 py-2 border-b">{log.os}</td>
                </tr>
            ))
            )}
        </tbody>
        </table>
    </div>

    {/* ویجت آنالیز زنده */}
<RealtimeAnalyticsWidget token={token} />

{/* نقشه زنده */}
<LiveMapWidget token={token} />

{/* نقشه گرمایی با اسلایدر زمانی */}
<LiveHeatmapWidget 
token={token} 
historicalLogs={data.logs} 
/>
    
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

function formatDate(date) {
return date ? new Date(date).toLocaleString("fa-IR") : "-";
}