import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useToast } from "../context/ToastContext";
import { getStatusLabel, getStatusColor } from "../utils/statusManager";
import StatusBadge from "../components/StatusBadge"
import UpdateOrderStatusForm from "../components/UpdateOrderStatusForm";

export default function AdminOrderDetailPage() {
const { id } = useParams();
const navigate = useNavigate();
const { showToast } = useToast(); // ✅ استفاده از Toast

const [order, setOrder] = useState(null);
const [loading, setLoading] = useState(true);
const [status, setStatus] = useState("");

useEffect(() => {
    const fetchOrder = async () => {
    try {
        const token = localStorage.getItem("adminToken");
        const res = await axios.get(`http://localhost:5000/api/orders/orders/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        });

        setOrder(res.data.data);
        setStatus(res.data.data.paymentStatus);
    } catch (err) {
        console.error(err);
    } finally {
        setLoading(false);
    }
    };

    fetchOrder();
}, [id]);

const handleUpdateStatus = async () => {
    try {
    const token = localStorage.getItem("adminToken");
    await axios.put(
        `http://localhost:5000/api/orders/orders/${id}/status`,
        { paymentStatus: status },
        {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        }
    );
    showToast("وضعیت با موفقیت آپدیت شد.", "success");
    setOrder((prev) => ({ ...prev, paymentStatus: status }));
    } catch (err) {
    showToast("خطا در آپدیت وضعیت.", "error");
    console.error(err);
    }
};

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
        <p><strong>وضعیت:</strong>{""}
        <StatusBadge status={order.paymentStatus} type="orderStatuses" />
        </p>
        {/* فرم آپدیت وضعیت */}
<UpdateOrderStatusForm
orderId={order._id}
currentStatus={order.paymentStatus}
onUpdate={(updatedOrder) => {
    setOrder(updatedOrder);
}}
/>
        <p><strong>مبلغ:</strong> {order.amount.toLocaleString()} تومان</p>
        <p><strong>تاریخ:</strong> {new Date(order.createdAt).toLocaleDateString("fa-IR")}</p>
        <p>
<strong>وضعیت:</strong>{" "}
<span className={`px-2 py-1 rounded text-sm ${getStatusColor(order.paymentStatus, "orderStatuses")}`}>
    {getStatusLabel(order.paymentStatus, "orderStatuses")}
</span>
</p>
    </div>

    <h3 className="mb-2 text-lg font-semibold">تغییر وضعیت</h3>
    <div className="flex items-center mb-6 space-x-2 space-x-reverse">
        <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="px-3 py-2 border rounded"
        >
        <option value="pending">در انتظار</option>
        <option value="paid">پرداخت شده</option>
        <option value="failed">ناموفق</option>
        <option value="canceled">لغو شده</option>
        </select>
        <button
        onClick={handleUpdateStatus}
        className="px-4 py-2 text-white bg-green-500 rounded"
        >
        ذخیره
        </button>
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
        onClick={() => navigate("/admin/orders")}
        className="px-4 py-2 text-white bg-gray-500 rounded"
    >
        بازگشت
    </button>
    </div>
);
}