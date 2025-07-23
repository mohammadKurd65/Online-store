import React, { useEffect, useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import {
Chart as ChartJS,
CategoryScale,
LinearScale,
BarElement,
ArcElement,
Title,
Tooltip,
Legend,
} from "chart.js";
import axios from "axios";

// ثبت کامپوننت‌های ChartJS
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

export default function TagStatisticsPage() {
const [tags, setTags] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
    const fetchTagStats = async () => {
    try {
        const token = localStorage.getItem("adminToken");
        const res = await axios.get("http://localhost:5000/api/admin/reports/tags/popular", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        });
        setTags(res.data.tags || []);
    } catch (err) {
        console.error(err);
    } finally {
        setLoading(false);
    }
    };

    fetchTagStats();
}, [ setLoading, setTags]);

  // داده‌های نمودار ستونی
const barChartData = {
    labels: tags.slice(0, 10).map(t => t._id),
    datasets: [
    {
        label: "تعداد استفاده",
        data: tags.slice(0, 10).map(t => t.count),
        backgroundColor: "#3b82f6",
    },
    ],
};

  // داده‌های نمودار دایره‌ای (برای 7 تگ برتر)
const pieChartData = {
    labels: tags.slice(0, 7).map(t => t._id),
    datasets: [
    {
        data: tags.slice(0, 7).map(t => t.count),
        backgroundColor: [
        "#6366f1",
        "#8b5cf6",
        "#ec4899",
        "#f97316",
        "#10b981",
        "#f59e0b",
        "#ef4444",
        ],
    },
    ],
};

  // محاسبات آماری
const totalTags = tags.length;
const totalUses = tags.reduce((sum, t) => sum + t.count, 0);
const mostUsed = tags[0] || null;
const leastUsed = tags[tags.length - 1] || null;

if (loading) return <p>در حال بارگذاری آمار تگ‌ها...</p>;

return (
    <div className="container py-10 mx-auto">
    <h2 className="mb-6 text-3xl font-bold">آمار تگ‌های گزارش</h2>

      {/* آمار کلی */}
    <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-4">
        <StatCard title="تگ‌های منحصربفرد" value={totalTags} color="bg-blue-500" />
        <StatCard title="کل استفاده‌ها" value={totalUses} color="bg-green-500" />
        <StatCard title="پرتکرارترین" value={mostUsed?.count || 0} subtitle={mostUsed?._id || "-"} color="bg-yellow-500" />
        <StatCard title="کم‌ترین استفاده" value={leastUsed?.count || 0} subtitle={leastUsed?._id || "-"} color="bg-gray-500" />
    </div>

      {/* نمودارها */}
    <div className="grid grid-cols-1 gap-8 mb-8 lg:grid-cols-2">
        <div className="p-6 bg-white rounded shadow">
        <h3 className="mb-4 text-xl font-semibold">۱۰ تگ برتر (ستونی)</h3>
        <Bar
            data={barChartData}
            options={{
            responsive: true,
            plugins: {
                legend: { display: false },
                tooltip: {
                callbacks: {
                    label: (context) => `${context.raw} بار استفاده`
                }
                }
            },
            scales: {
                y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 1
                }
                }
            }
            }}
/>
        </div>

        <div className="p-6 bg-white rounded shadow">
        <h3 className="mb-4 text-xl font-semibold">توزیع تگ‌ها (دایره‌ای)</h3>
        <Pie
            data={pieChartData}
            options={{
            responsive: true,
            plugins: {
                legend: { position: "right" },
                tooltip: {
                callbacks: {
                    label: (context) => `${context.label}: ${context.raw} بار`
                }
                }
            }
            }}
        />
        </div>
    </div>

      {/* لیست کامل تگ‌ها */}
    <div className="p-6 bg-white rounded shadow">
        <h3 className="mb-4 text-xl font-semibold">لیست تمام تگ‌ها</h3>
        <table className="min-w-full">
        <thead className="bg-gray-100">
            <tr>
            <th className="px-4 py-2 text-left border-b">نام تگ</th>
            <th className="px-4 py-2 text-left border-b">تعداد استفاده</th>
            <th className="px-4 py-2 text-left border-b">درصد</th>
            </tr>
        </thead>
        <tbody>
            {tags.length === 0 ? (
            <tr>
                <td colSpan="3" className="py-4 text-center text-gray-500">
                هیچ تگی وجود ندارد.
                </td>
            </tr>
            ) : (
            tags.map((tag, index) => {
                const percentage = ((tag.count / totalUses) * 100).toFixed(1);
                return (
                <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-2 font-medium border-b">{tag._id}</td>
                    <td className="px-4 py-2 border-b">{tag.count}</td>
                    <td className="px-4 py-2 border-b">{percentage}%</td>
                </tr>
                );
            })
            )}
        </tbody>
        </table>
    </div>
    </div>
);
}

// کامپوننت آمار
function StatCard({ title, value, subtitle, color }) {
return (
    <div className={`p-6 rounded shadow text-white ${color}`}>
    <h3 className="text-lg">{title}</h3>
    <p className="mt-2 text-xl font-bold">{value}</p>
    {subtitle && <p className="text-sm opacity-90">{subtitle}</p>}
    </div>
);
}