import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { decodeToken } from "../utils/jwtDecode";

export default function UserDashboardPage() {
const [stats, setStats] = useState({
    totalOrders: 0,
    paidOrders: 0,
    pendingOrders: 0,
    canceledOrders: 0,
});
const navigate = useNavigate();
const token = localStorage.getItem("userToken");
const decoded = decodeToken(token);
const userRole = decoded?.role;

useEffect(() => {
if (userRole !== "admin") {
    navigate("/unauthorized");
}
}, [userRole, navigate]);

useEffect(() => {
    const fetchStats = async () => {
    try {
        const token = localStorage.getItem("userToken");
        const res = await axios.get("http://localhost:5000/api/orders/user/orders", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        });

        const orders = res.data.data;

        setStats({
        totalOrders: orders.length,
        paidOrders: orders.filter((o) => o.paymentStatus === "paid").length,
        pendingOrders: orders.filter((o) => o.paymentStatus === "pending").length,
        canceledOrders: orders.filter((o) => o.paymentStatus === "canceled").length,
        });
    } catch (err) {
        console.error(err);
        alert("خطا در دریافت آمار.");
        navigate("/user/login");
    }
    };

    fetchStats();
}, [navigate]);

return (
    <div className="container py-10 mx-auto">
    <h2 className="mb-6 text-3xl font-bold">داشبورد کاربر</h2>

      {/* آمار */}
    <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-4">
        <div className="p-6 text-center bg-white rounded shadow">
        <h3 className="text-lg text-gray-600">سفارشات کل</h3>
        <p className="mt-2 text-3xl font-bold">{stats.totalOrders}</p>
        </div>

        <div className="p-6 text-center bg-white rounded shadow">
        <h3 className="text-lg text-gray-600">پرداخت شده</h3>
        <p className="mt-2 text-3xl font-bold">{stats.paidOrders}</p>
        </div>

        <div className="p-6 text-center bg-white rounded shadow">
        <h3 className="text-lg text-gray-600">در انتظار</h3>
        <p className="mt-2 text-3xl font-bold">{stats.pendingOrders}</p>
        </div>

        <div className="p-6 text-center bg-white rounded shadow">
        <h3 className="text-lg text-gray-600">لغو شده</h3>
        <p className="mt-2 text-3xl font-bold">{stats.canceledOrders}</p>
        </div>
    </div>

      {/* دکمه‌های سریع */}
    <div className="grid grid-cols-1 gap-4 mb-8 md:grid-cols-3">
        <button
        onClick={() => navigate("/user/profile")}
        className="px-4 py-3 text-white bg-blue-500 rounded hover:bg-blue-600"
        >
        پروفایل من
        </button>

        <button
        onClick={() => navigate("/user/orders")}
        className="px-4 py-3 text-white bg-green-500 rounded hover:bg-green-600"
        >
        لیست سفارشات
        </button>

        <button
        onClick={() => navigate("/cart")}
        className="px-4 py-3 text-white bg-purple-500 rounded hover:bg-purple-600"
        >
        سبد خرید
        </button>
    </div>

      {/* لیست آخرین سفارشات */}
    <div className="p-6 bg-white rounded shadow">
        <h3 className="mb-4 text-xl font-semibold">آخرین سفارشات</h3>
        <OrderList />
    </div>
    </div>
);
}

// کامپوننت کوچک برای لیست سفارشات
function OrderList() {
const [orders, setOrders] = useState([]);
const navigate = useNavigate();

useEffect(() => {
    const fetchOrders = async () => {
    try {
        const token = localStorage.getItem("userToken");
        const res = await axios.get("http://localhost:5000/api/orders/user/orders?limit=5", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        });
        setOrders(res.data.data || []);
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
            <th className="px-4 py-2 text-left border-b">مشاهده</th>
        </tr>
        </thead>
        <tbody>
        {orders.map((order) => (
            <tr key={order._id} className="hover:bg-gray-50">
            <td className="px-4 py-2 border-b">{order._id}</td>
            <td className="px-4 py-2 border-b">{order.amount.toLocaleString()} تومان</td>
            <td className="px-4 py-2 capitalize border-b">{order.paymentStatus}</td>
            <td className="px-4 py-2 border-b">
                <a href={`/user/order/${order._id}`} className="text-blue-500 hover:underline">
                مشاهده
                </a>
            </td>
            </tr>
        ))}
        </tbody>
    </table>
    </div>
);
}