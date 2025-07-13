import React, { useEffect, useState } from "react";
import axios from "axios";
import ReusableFilterForm from "../components/ReusableFilterForm";
import StatusBadge from "../components/StatusBadge";
import { usePersistedFilter } from "../hooks/usePersistedFilter";
import DeleteOrderModal from "../components/DeleteOrderModal";
import { decodeToken } from "../utils/jwtDecode";
import { useNavigate } from "react-router-dom";

export default function CartPage() {
const [orders, setOrders] = useState([]);
const [loading, setLoading] = useState(true);
  // فیلترها
const [filters, setFilters] = usePersistedFilter("user-cart-filter", {
    status: "",
    startDate: "",
    endDate: "",
});
const [showModal, setShowModal] = useState(false);
const [selectedOrder, setSelectedOrder] = useState(null);
const token = localStorage.getItem("userToken");
const decoded = decodeToken(token);
const userRole = decoded?.role;
const navigate = useNavigate();

useEffect(() => {
if (userRole !== "admin") {
    navigate("/unauthorized");
}
}, [userRole, navigate]);

const handleDeleteClick = (order) => {
setSelectedOrder(order);
setShowModal(true);
};

const handleDeleteConfirm = async () => {
try {
    const token = localStorage.getItem("adminToken"); // بعداً ادمین و کاربر عادی رو جدا کن
    await axios.delete(`http://localhost:5000/api/orders/orders/${selectedOrder._id}`, {
headers: {
        Authorization: `Bearer ${token}`,
    },
    });

    setOrders(orders.filter((o) => o._id !== selectedOrder._id));
    setShowModal(false);
} catch (err) {
    alert("خطا در حذف سفارش.");
    console.error(err);
}
};

useEffect(() => {
    const fetchOrders = async () => {
    try {
        const params = new URLSearchParams();
        if (filters.status) params.append("status", filters.status);
        if (filters.startDate) params.append("startDate", filters.startDate);
        if (filters.endDate) params.append("endDate", filters.endDate);

        // در حال حاضر از API عمومی استفاده میکنیم – بعداً با Auth آپدیت میشه
        const res = await axios.get(`http://localhost:5000/api/orders/orders?${params}`);

        setOrders(res.data.data);
    } catch (err) {
        console.error(err);
    } finally {
        setLoading(false);
    }
    };

    fetchOrders();
}, [filters]);

if (loading) {
    return <p>در حال بارگذاری...</p>;
}

return (
    <div className="container py-10 mx-auto">
    <h2 className="mb-6 text-2xl font-bold">سبد خرید من</h2>

      {/* فرم فیلتر */}
    <ReusableFilterForm
        filters={filters}
        onFilterChange={setFilters}
        showRole={false}
        showDateRange={true}
        showSearchTerm={false}
        showStatus={true}
    />

      {/* جدول لیست سفارشات */}
    <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded shadow">
        <thead className="bg-gray-100">
            <tr>
            <th className="px-4 py-2 text-left border-b">شناسه</th>
            <th className="px-4 py-2 text-left border-b">مبلغ</th>
            <th className="px-4 py-2 text-left border-b">وضعیت</th>
            <th className="px-4 py-2 text-left border-b">تاریخ</th>
            </tr>
        </thead>
    <tbody>
    {orders.length === 0 ? (
    <tr>
        <td colSpan="5" className="py-4 text-center">سبد خرید شما خالی است.</td>
    </tr>
    ) : (
    orders.map((order) => (
        <tr key={order._id} className="hover:bg-gray-50">
        <td className="px-4 py-2 border-b">{order._id}</td>
        <td className="px-4 py-2 border-b">{order.amount.toLocaleString()} تومان</td>
        <td className="px-4 py-2 border-b">
            <StatusBadge status={order.paymentStatus} type="orderStatuses" />
        </td>
        <td className="px-4 py-2 border-b">
            {new Date(order.createdAt).toLocaleDateString("fa-IR")}
        </td>
        <td className="px-4 py-2 border-b">
            <button
            onClick={() => handleDeleteClick(order)}
            className="text-red-500 hover:underline"
            >
            حذف
            </button>
        </td>
        </tr>
    ))
    )}
</tbody>
        </table>
        {/* مدال حذف */}
<DeleteOrderModal
isOpen={showModal}
onClose={() => setShowModal(false)}
onConfirm={handleDeleteConfirm}
itemName={`سفارش #${selectedOrder?._id || ""}`}
/>
    </div>
    </div>
);
}