import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { decodeToken } from "../utils/jwtDecode";
import { usePermission } from "../hooks/usePermission";
export default function OrderDetailPage() {
    const { canDeleteUsers } = usePermission();

if (canDeleteUsers) {
  // نمایش دکمه حذف
}
const { id } = useParams();
const [order, setOrder] = useState(null);
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
    const fetchOrder = async () => {
    try {
        const res = await axios.get(`http://localhost:5000/api/orders/orders/${id}`);
        setOrder(res.data.data);
    } catch (err) {
        console.error(err);
    } finally {
        setLoading(false);
    }
    };

    fetchOrder();
}, [id]);

if (loading) {
    return <p>در حال بارگذاری...</p>;
}

if (!order) {
    return <p>سفارشی یافت نشد.</p>;
}

return (
    <div className="container py-10 mx-auto">
    <h2 className="mb-6 text-2xl font-bold">جزئیات سفارش #{order._id}</h2>

    <div className="mb-4">
        <p><strong>وضعیت:</strong> {order.paymentStatus}</p>
        <p><strong>مبلغ:</strong> {order.amount.toLocaleString()} تومان</p>
        <p><strong>تاریخ:</strong> {new Date(order.createdAt).toLocaleString("fa-IR")}</p>
    </div>

    <h3 className="mb-2 text-lg font-semibold">محصولات:</h3>
    <ul className="mb-4 list-disc list-inside">
        {order.products.map((product, index) => (
        <li key={index}>
            {product.name} - {product.price.toLocaleString()} تومان × {product.quantity}
        </li>
        ))}
    </ul>

    <button
        onClick={() => window.history.back()}
        className="px-4 py-2 text-white bg-gray-500 rounded"
    >
        بازگشت
    </button>
    </div>
);
}