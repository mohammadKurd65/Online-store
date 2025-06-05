import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function AdminDashboard() {
const [stats, setStats] = useState({
    totalOrders: 0,
    totalAdmins: 0,
    totalRevenue: 0,
});

useEffect(() => {
    const fetchStats = async () => {
    try {
        const token = localStorage.getItem("adminToken");
        const res = await axios.get("http://localhost:5000/api/admin/dashboard", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        });
        setStats(res.data.data);
    } catch (err) {
        console.error(err);
    }
    };

    fetchStats();
}, []);

const [monthlySales, setMonthlySales] = useState([]);

useEffect(() => {
const fetchMonthlySales = async () => {
    try {
    const token = localStorage.getItem("adminToken");
    const res = await axios.get("http://localhost:5000/api/admin/dashboard/monthly-sales", {
        headers: {
        Authorization: `Bearer ${token}`,
        },
    });

    setMonthlySales(res.data.data);
    } catch (err) {
    console.error(err);
    }
};

fetchMonthlySales();
}, []);

return (
    <div className="container py-10 mx-auto">
    <h2 className="mb-6 text-3xl font-bold">داشبورد پنل ادمین</h2>

    <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-3">
        <div className="p-6 text-center bg-white rounded shadow">
        <h3 className="text-lg text-gray-600">تعداد کل سفارشات</h3>
        <p className="mt-2 text-3xl font-bold">{stats.totalOrders}</p>
        </div>

        <div className="p-6 text-center bg-white rounded shadow">
        <h3 className="text-lg text-gray-600">تعداد ادمین‌ها</h3>
        <p className="mt-2 text-3xl font-bold">{stats.totalAdmins}</p>
        </div>

        <div className="p-6 text-center bg-white rounded shadow">
        <h3 className="text-lg text-gray-600">مجموع فروش</h3>
        <p className="mt-2 text-3xl font-bold">{stats.totalRevenue.toLocaleString()} تومان</p>
        </div>
    </div>

    <div className="p-6 bg-white rounded shadow">
        <h3 className="mb-4 text-xl font-semibold">آخرین سفارشات</h3>
        <OrderList />
        <div className="p-6 mt-8 bg-white rounded shadow">
<h3 className="mb-4 text-xl font-semibold">آمار فروش ماهانه</h3>
{monthlySales.length === 0 ? (
<p>آماری یافت نشد.</p>
) : (
    <Bar
    data={{
        labels: monthlySales.map((item) => `ماه ${item._id.month} (${item._id.year})`),
        datasets: [
        {
            label: "فروش (تومان)",
            backgroundColor: "rgba(53, 162, 235, 0.5)",
            borderColor: "rgba(53, 162, 235, 1)",
            borderWidth: 1,
            data: monthlySales.map((item) => item.totalSales),
        },
        ],
    }}
    options={{
        responsive: true,
        plugins: {
        legend: { display: true },
        tooltip: {
            callbacks: {
            label: (context) => `${context.raw.toLocaleString()} تومان`,
            },
        },
        title: {
            display: true,
            text: "فروش ماهانه",
        },
        },
        scales: {
        y: {
            ticks: {
            callback: (value) => value.toLocaleString(),
            },
        },
        },
    }}
    />
)}
</div>
    </div>
    </div>
);
}

// کامپوننت کوچک برای لیست سفارشات
function OrderList() {
const [orders, setOrders] = useState([]);

useEffect(() => {
    const fetchOrders = async () => {
    try {
        const token = localStorage.getItem("adminToken");
        const res = await axios.get("http://localhost:5000/api/orders/orders", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        });
        setOrders(res.data.data.slice(0, 5)); // فقط 5 سفارش اول
    } catch (err) {
        console.error(err);
    }
    };

    fetchOrders();
}, []);

return (
    <div className="overflow-x-auto">
    <table className="min-w-full bg-white border rounded">
        <thead className="bg-gray-100">
        <tr>
            <th className="px-4 py-2 text-left border-b">شناسه</th>
            <th className="px-4 py-2 text-left border-b">مبلغ</th>
            <th className="px-4 py-2 text-left border-b">وضعیت</th>
            <th className="px-4 py-2 text-left border-b">تاریخ</th>
        </tr>
        </thead>
        <tbody>
        {orders.map((order) => (
            <tr key={order._id} className="hover:bg-gray-50">
            <td className="px-4 py-2 border-b">{order._id}</td>
            <td className="px-4 py-2 border-b">{order.amount.toLocaleString()} تومان</td>
            <td className="px-4 py-2 capitalize border-b">{order.paymentStatus}</td>
            <td className="px-4 py-2 border-b">
                {new Date(order.createdAt).toLocaleDateString("fa-IR")}
            </td>
            </tr>
        ))}
        </tbody>
    </table>
    </div>
);
}