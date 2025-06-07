import React, { useEffect, useState } from "react";
import axios from "axios";
import ReusableFilterForm from "../components/ReusableFilterForm";
import usePersistedFilter from "../hooks/usePersistedFilter"

export default function AdminOrdersPage() {
    const [page, setPage] = useState(1);
const [totalPages, setTotalPages] = useState(1);
const [orders, setOrders] = useState([]);
const [loading, setLoading] = useState(true);
const [filters, setFilters] = usePersistedFilter("admin-orders-filter", {
searchTerm: "",
status: "",
startDate: "",
endDate: "",
});

useEffect(() => {
const fetchOrders = async () => {
try {
    const params = new URLSearchParams();
    params.append("page", page);
    if (filters.status) params.append("status", filters.status);
    if (filters.startDate) params.append("startDate", filters.startDate);
    if (filters.endDate) params.append("endDate", filters.endDate);

    const token = localStorage.getItem("adminToken");
    const res = await axios.get(`http://localhost:5000/api/orders/orders?${params}`, {
    headers: {
        Authorization: `Bearer ${token}`,
    },
    });

    setOrders(res.data.data);
    setTotalPages(res.data.pagination.totalPages);
} catch (err) {
    console.error(err);
} finally {
    setLoading(false);
}
};

    fetchOrders();
}, [page, filters]);

if (loading) {
    return <p>در حال بارگذاری سفارشات...</p>;
}

return (
    <div className="container py-10 mx-auto">
    <h2 className="mb-6 text-3xl font-bold">پنل مدیریت سفارشات</h2>
     {/* فیلد جستجو */}
        <ReusableFilterForm
filters={filters}
onFilterChange={setFilters}
showRole={false}
showDateRange={true}
showStatus={true}
  showSearchTerm={false} // اگر جستجوی محلی نداریم
/>
    {orders.length === 0 ? (
        <p>سفارشی یافت نشد.</p>
    ) : (
        <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded shadow">
            <thead className="bg-gray-100">
            <tr>
                <th className="px-4 py-2 text-left border-b">شناسه</th>
                <th className="px-4 py-2 text-left border-b">مبلغ</th>
                <th className="px-4 py-2 text-left border-b">وضعیت</th>
                <th className="px-4 py-2 text-left border-b">تاریخ</th>
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
                    {new Date(order.createdAt).toLocaleDateString("fa-IR")}
                </td>
                <td className="px-4 py-2 border-b">
                    <a href={`/admin/order/${order._id}`} className="text-blue-500 hover:underline">
                    مشاهده جزئیات
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