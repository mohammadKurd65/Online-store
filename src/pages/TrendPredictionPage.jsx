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
import { exportPredictionToCSV } from "../utils/exportPredictionToCSV";
import { exportPredictionToExcel } from "../utils/exportPredictionToExcel";
import { exportExcelWithChart } from "../utils/exportExcelWithChart";
import { generateDataEntryTemplate } from "../utils/generateDataEntryTemplate";

// ثبت کامپوننت‌های ChartJS
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function TrendPredictionPage() {
const [data, setData] = useState(null);
const [loading, setLoading] = useState(true);
const [period, setPeriod] = useState("monthly");
const [forecastMonths, setForecastMonths] = useState(3);

useEffect(() => {
    const fetchPrediction = async () => {
    try {
        const token = localStorage.getItem("adminToken");
        const res = await axios.get(
        `http://localhost:5000/api/admin/reports/tags/predict?period=${period}&forecast=${forecastMonths}`,
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

    fetchPrediction();
}, [period, forecastMonths, setLoading, setData, setForecastMonths, setPeriod]);

if (loading) return <p>در حال بارگذاری پیش‌بینی...</p>;
if (!data || !data.predictions) return <p>داده‌ای برای پیش‌بینی وجود ندارد.</p>;

  // داده‌های نمودار
const allPeriods = [...data.historical.map(h => h.period), ...data.forecast.map(f => f.period)];
const chartData = {
    labels: allPeriods,
    datasets: Object.keys(data.predictions).map(tag => ({
    label: tag,
    data: [
        ...data.historical.map(h => h.tags[tag] || 0),
        ...data.forecast.map(f => f.tags[tag] || 0)
    ],
    borderColor: getRandomColor(),
    backgroundColor: 'transparent',
    tension: 0.4,
    pointRadius: (ctx) => ctx.dataIndex < data.historical.length ? 4 : 0,
      borderDash: (ctx) => ctx.dataIndex < data.historical.length ? [] : [5, 5], // خط خاکستری برای پیش‌بینی
    })),
};
const chartOptions = {
    responsive: true,
    plugins: {
    legend: { position: "top" },
    tooltip: {
        callbacks: {
        label: (context) => `${context.dataset.label}: ${context.raw} بار`
        }
    }
    },
    scales: {
    y: {
        beginAtZero: true,
        ticks: { stepSize: 1 }
    },
    x: {
        title: {
        display: true,
        text: 'دوره زمانی'
        }
    }
    }
};

return (
    <div className="container py-10 mx-auto">
    <h2 className="mb-6 text-3xl font-bold">پیش‌بینی روند تگ‌ها</h2>

      {/* فیلترها */}
    <div className="grid grid-cols-1 gap-4 p-6 mb-6 bg-white rounded shadow md:grid-cols-3">
        <div>
        <label className="block mb-2 text-gray-700">دوره زمانی</label>
        <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="w-full px-3 py-2 border rounded"
        >
            <option value="weekly">هفتگی</option>
            <option value="monthly">ماهانه</option>
        </select>
        </div>
        <div>
        <label className="block mb-2 text-gray-700">پیش‌بینی برای</label>
        <select
            value={forecastMonths}
            onChange={(e) => setForecastMonths(parseInt(e.target.value))}
            className="w-full px-3 py-2 border rounded"
        >
            <option value={1}>1 دوره</option>
            <option value={2}>2 دوره</option>
            <option value={3}>3 دوره</option>
            <option value={6}>6 دوره</option>
        </select>
        </div>
        <div>
        <label className="block mb-2 text-gray-700">تعداد تگ‌ها</label>
        <span className="block mt-1 text-gray-900">{data.topTags.length} تگ برتر</span>
        </div>
    </div>

      {/* نمودار */}
    <div className="p-6 mb-8 bg-white rounded shadow">
        <h3 className="mb-4 text-xl font-semibold">پیش‌بینی استفاده آینده</h3>
        <Line data={chartData} options={chartOptions} />
    </div>

      {/* توضیحات */}
    <div className="p-6 mb-8 border border-blue-200 rounded shadow bg-blue-50">
        <h3 className="mb-2 text-lg font-semibold text-blue-800">چگونه پیش‌بینی انجام شده؟</h3>
        <p className="text-blue-700">
        این پیش‌بینی با استفاده از <strong>رگرسیون خطی ساده</strong> بر اساس داده‌های تاریخی انجام شده.
        خطوط پیش‌بینی با رنگ خاکستری مشخص شده‌اند.
        </p>
    </div>

    <div className="p-6 mb-8 border border-blue-200 rounded shadow bg-blue-50">
<h3 className="mb-2 text-lg font-semibold text-blue-800">چگونه پیش‌بینی انجام شده؟</h3>
<p className="text-blue-700">
    این پیش‌بینی با استفاده از <strong>میانگین متحرک وزنی (WMA)</strong> انجام شده.
    داده‌های اخیر وزن بیشتری دارن، پس پیش‌بینی نسبت به روندهای اخیر حساس‌تره.
</p>
</div>

      {/* آمار کلی */}
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <StatCard title="دوره‌های تاریخی" value={data.historical.length} color="bg-blue-500" />
        <StatCard title="دوره‌های پیش‌بینی" value={data.forecast.length} color="bg-green-500" />
        <StatCard title="تگ‌های تحلیل شده" value={data.topTags.length} color="bg-purple-500" />
    </div>

{/* دکمه خروجی CSV */}
<div className="flex justify-end mb-6">
<button
    onClick={() => exportPredictionToCSV(data.historical, data.forecast, data.topTags)}
    className="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600"
>
    📥 خروجی CSV پیش‌بینی
</button>
</div>

{/* دکمه خروجی اکسل */}
<button
onClick={() => exportPredictionToExcel(data.historical, data.forecast, data.topTags)}
className="px-4 py-2 mr-2 text-white bg-blue-500 rounded hover:bg-blue-600"
>
📘 خروجی اکسل
</button>
    
{/* دکمه خروجی اکسل با نمودار */}
<button
onClick={() => exportExcelWithChart(data.historical, data.forecast, data.topTags)}
className="px-4 py-2 mr-2 text-white bg-purple-500 rounded hover:bg-purple-600"
>
📊 اکسل با نمودار
</button>

{/* دکمه دانلود قالب */}
<button
onClick={generateDataEntryTemplate}
className="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600"
>
📥 دانلود قالب ورود داده
</button>
    
    </div>
);
}

// توابع کمکی
function getRandomColor() {
const colors = [
    "#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6",
    "#ec4899", "#06b6d4", "#d97706", "#84cc16", "#f97316"
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