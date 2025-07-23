import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import axios from "axios";
import { exportToCSV } from "../utils/exportToCSV";
import { exportToExcel } from "../utils/exportToExcel";

// ثبت کامپوننت‌های ChartJS
ChartJS.register(
LinearScale,
PointElement,
LineElement,
Title,
Tooltip,
Legend
);

export default function TagTrendsPage() {
const [trends, setTrends] = useState([]);
const [loading, setLoading] = useState(true);
const [topTags, setTopTags] = useState([]);

  // فیلترها
const [filters, setFilters] = useState({
    period: "monthly", // monthly, weekly
    topN: 5,
});

useEffect(() => {
    const fetchTrends = async () => {
    try {
        const token = localStorage.getItem("adminToken");
        const params = new URLSearchParams(filters);

        const res = await axios.get(
        `http://localhost:5000/api/admin/reports/tags/trends?${params}`,
        {
            headers: { Authorization: `Bearer ${token}` },
        }
        );

        setTrends(res.data.trends || []);
        setTopTags(res.data.topTags || []);
    } catch (err) {
        console.error(err);
    } finally {
        setLoading(false);
    }
    };

    fetchTrends();
}, [filters, setFilters, setTrends, setTopTags, setLoading]);

  // داده‌های نمودار خطی
const chartData = {
    labels: trends.map((t) => t.period),
    datasets: topTags.map((tag) => ({
    label: tag,
    data: trends.map((t) => t.tags[tag] || 0),
    borderColor: getRandomColor(),
    backgroundColor: "transparent",
    tension: 0.4,
    pointRadius: 4,
    })),
};

const chartOptions = {
    responsive: true,
    plugins: {
    legend: { position: "top" },
    tooltip: {
        callbacks: {
        label: (context) => `${context.dataset.label}: ${context.raw} بار`,
        },
    },
    },
    scales: {
    y: {
        beginAtZero: true,
        ticks: { stepSize: 1 },
    },
    },
};

return (
    <div className="container py-10 mx-auto">
    <h2 className="mb-6 text-3xl font-bold">روند استفاده از تگ‌ها</h2>

      {/* فیلترها */}
    <div className="grid grid-cols-1 gap-4 p-6 mb-6 bg-white rounded shadow md:grid-cols-3">
        <div>
        <label className="block mb-2 text-gray-700">دوره زمانی</label>
        <select
            value={filters.period}
            onChange={(e) =>
            setFilters((prev) => ({ ...prev, period: e.target.value }))
            }
            className="w-full px-3 py-2 border rounded"
        >
            <option value="weekly">هفتگی</option>
            <option value="monthly">ماهانه</option>
        </select>
        </div>
        <div>
        <label className="block mb-2 text-gray-700">تعداد تگ‌ها</label>
        <select
            value={filters.topN}
            onChange={(e) =>
            setFilters((prev) => ({
                ...prev,
                topN: parseInt(e.target.value),
            }))
            }
            className="w-full px-3 py-2 border rounded"
        >
            {[3, 5, 7, 10].map((n) => (
            <option key={n} value={n}>
                {n} تگ برتر
            </option>
            ))}
        </select>
        </div>
        <div>
        <label className="block mb-2 text-gray-700">تعداد داده</label>
        <select
            value={filters.limit || 12}
            onChange={(e) =>
            setFilters((prev) => ({
                ...prev,
                limit: parseInt(e.target.value),
            }))
            }
            className="w-full px-3 py-2 border rounded"
        >
            <option value={6}>6 دوره</option>
            <option value={12}>12 دوره</option>
            <option value={24}>24 دوره</option>
        </select>
        </div>
    </div>

      {/* نمودار */}
    <div className="p-6 mb-8 bg-white rounded shadow">
        <h3 className="mb-4 text-xl font-semibold">روند استفاده از تگ‌ها</h3>
        {loading ? (
        <p>در حال بارگذاری...</p>
        ) : trends.length === 0 ? (
        <p className="text-gray-500">داده‌ای برای نمایش وجود ندارد.</p>
        ) : (
        <Line data={chartData} options={chartOptions} />
        )}
    </div>

      {/* آمار کلی */}
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <StatCard
        title="دوره‌های تحلیل شده"
        value={trends.length}
        color="bg-blue-500"
        />
        <StatCard
        title="تگ‌های نمایش داده شده"
        value={topTags.length}
        color="bg-green-500"
        />
        <StatCard
        title="کل استفاده‌ها"
        value={trends.reduce(
            (sum, t) => sum + Object.values(t.tags).reduce((a, b) => a + b, 0),
            0
        )}
        color="bg-purple-500"
        />
    </div>

{/* دکمه خروجی CSV */}
<div className="flex justify-end mb-6">
<button
    onClick={() => exportToCSV(trends, topTags, filters.period)}
    className="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600"
>
    📥 خروجی CSV
</button>
</div>
    
{/* دکمه خروجی اکسل */}
<button
onClick={() => exportToExcel(trends, topTags, filters.period)}
className="px-4 py-2 mr-2 text-white bg-blue-500 rounded hover:bg-blue-600"
>
📘 خروجی اکسل
</button>
    
    </div>
);
}

// توابع کمکی
function getRandomColor() {
const colors = [
    "#3b82f6", // blue
    "#10b981", // green
    "#f59e0b", // amber
    "#ef4444", // red
    "#8b5cf6", // purple
    "#ec4899", // pink
    "#06b6d4", // cyan
    "#d97706", // orange
];
  return colors[Math.floor(Math.random() * colors.length)];
}

function StatCard({ title, value, color }) {
return (
    <div className={`p-6 rounded shadow text-white ${color}`}>
    <h3 className="text-lg">{title}</h3>
    <p className="mt-2 text-xl font-bold">{value}</p>
    </div>
);
}
