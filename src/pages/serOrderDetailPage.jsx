import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function UserOrderDetailPage() {
const { id } = useParams();
const navigate = useNavigate();
const [order, setOrder] = useState(null);
const [loading, setLoading] = useState(true);

useEffect(() => {
    const fetchOrder = async () => {
    try {
        const token = localStorage.getItem("userToken");
        const res = await axios.get(`http://localhost:5000/api/orders/user/orders/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        });

        setOrder(res.data.data);
    } catch (err) {
        console.error(err);
        alert("خطا در دریافت اطلاعات سفارش.");
        navigate("/user/profile");
    } finally {
        setLoading(false);
    }
    };

    fetchOrder();
}, [id, navigate]);

if (loading) return <p>در حال بارگذاری...</p>;
if (!order) return <p>سفارشی یافت نشد.</p>;

return (
    <div className="container py-10 mx-auto">
    <h2 className="mb-6 text-3xl font-bold">جزئیات سفارش #{order._id}</h2>

    <div className="mb-4">
        <p><strong>وضعیت:</strong> {order.paymentStatus}</p>
        <p><strong>مبلغ:</strong> {order.amount.toLocaleString()} تومان</p>
        <p><strong>تاریخ:</strong> {new Date(order.createdAt).toLocaleDateString("fa-IR")}</p>
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
        onClick={() => navigate("/user/profile")}
        className="px-4 py-2 text-white bg-gray-500 rounded hover:bg-gray-600"
    >
        بازگشت
    </button>
    </div>
);
}