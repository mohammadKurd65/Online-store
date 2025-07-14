import React, { useEffect, useState } from "react";
import axios from "axios";
import { decodeToken } from "../utils/jwtDecode";
import { useNavigate } from "react-router-dom";
import { usePermission } from "../hooks/usePermission";
export default function OrdersPage() {
    const { canDeleteUsers } = usePermission();

if (canDeleteUsers) {
  // نمایش دکمه حذف
}
const [orders, setOrders] = useState([]);
const [loading, setLoading] = useState(true);
const token = localStorage.getItem("userToken");
const decoded = decodeToken(token);
const userRole = decoded?.role;
const navigate = useNavigate();

useEffect(() => {
if (userRole !== "admin") {
    navigate("/unauthorized");
}
}, [userRole, navigate]);

useEffect(() => {
    const fetchOrders = async () => {
    try {
        const res = await axios.get("http://localhost:5000/api/orders/orders");
        setOrders(res.data.data);
    } catch (err) {
        console.error(err);
    } finally {
        setLoading(false);
    }
    };

    fetchOrders();
}, []);

if (loading) {
    return <p>در حال بارگذاری...</p>;
}

return (
    <div className="container py-10 mx-auto">
    <h2 className="mb-6 text-2xl font-bold">لیست سفارشات</h2>
    {orders.length === 0 ? (
        <p>سفارشی یافت نشد.</p>
    ) : (
        <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded shadow">
            <thead className="bg-gray-100">
            <tr>
                <th className="px-4 py-2 border-b">شناسه</th>
                <th className="px-4 py-2 border-b">مبلغ</th>
                <th className="px-4 py-2 border-b">وضعیت</th>
                <th className="px-4 py-2 border-b">تاریخ</th>
                <th className="px-4 py-2 border-b">مشاهده</th>
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
                <td className="px-4 py-2 border-b">
                    <a href={`/orders/${order._id}`} className="text-blue-500 hover:underline">
                    مشاهده
                    </a>
                </td>
                </tr>
            ))}
            </tbody>
        </table>
        </div>
    )}
    </div>
);
}