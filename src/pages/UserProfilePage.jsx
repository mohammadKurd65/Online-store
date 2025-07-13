import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getStatusLabel, getStatusColor} from "../utils/statusManager";
import DeleteOrderModal from "../components/DeleteOrderModal"
import { decodeToken } from "../utils/jwtDecode";

export default function UserProfilePage() {
    const token = localStorage.getItem("userToken");
const decoded = decodeToken(token);
const userRole = decoded?.role;
const [user, setUser] = useState(null);
const [orders, setOrders] = useState([]);
const [statusFilter, setStatusFilter] = useState("");
const navigate = useNavigate();
const [showModal, setShowModal] = useState(false);
const [selectedOrder, setSelectedOrder] = useState(null);


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
    const token = localStorage.getItem("userToken");
    await axios.delete(`http://localhost:5000/api/orders/user/orders/${selectedOrder._id}`, {
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
const fetchData = async () => {
    try {
    const token = localStorage.getItem("userToken");

      // گرفتن اطلاعات کاربر
    const userRes = await axios.get("http://localhost:5000/api/user/profile", {
        headers: {
        Authorization: `Bearer ${token}`,
        },
    });

      // گرفتن لیست سفارشات با فیلتر
    const ordersRes = await axios.get(`http://localhost:5000/api/orders/user/orders?status=${statusFilter}`, {
        headers: {
        Authorization: `Bearer ${token}`,
        },
    });

    setUser(userRes.data.data);
    setOrders(ordersRes.data.data);
    } catch (err) {
    console.error(err);
    alert("خطا در دریافت اطلاعات.");
    navigate("/user/login");
    }
};

fetchData();
}, [navigate, statusFilter]);

const handleLogout = () => {
    localStorage.removeItem("userToken");
    navigate("/");
};

if (!user) return <p>در حال بارگذاری...</p>;

return (
    <div className="container py-10 mx-auto">
    <h2 className="mb-6 text-3xl font-bold">پروفایل کاربر</h2>

      {/* اطلاعات کاربر */}
    <div className="p-6 mb-8 bg-white rounded shadow">
        <p><strong>نام کاربری:</strong> {user.username}</p>
        <p><strong>عضویت از:</strong> {new Date(user.createdAt).toLocaleDateString("fa-IR")}</p>
        <button
        onClick={handleLogout}
        className="px-4 py-2 mt-4 text-white bg-red-500 rounded hover:bg-red-600"
        >
        خروج از حساب
        </button>
    </div>

{/* فیلد فیلتر وضعیت */}
<div className="mb-6">
<label className="block mb-2 text-gray-700">فیلتر بر اساس وضعیت</label>
<select
    value={statusFilter}
    onChange={(e) => setStatusFilter(e.target.value)}
    className="w-full px-3 py-2 border rounded md:w-1/2"
>
    <option value="">همه</option>
    <option value="pending">در انتظار</option>
    <option value="paid">پرداخت شده</option>
    <option value="failed">ناموفق</option>
    <option value="canceled">لغو شده</option>
</select>
</div>
      {/* لیست سفارشات */}
    <h3 className="mb-4 text-xl font-semibold">سفارشات من</h3>
    {orders.length === 0 ? (
        <p>هیچ سفارشی یافت نشد.</p>        
    ) : (
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
            {orders.map((order) => (
                <tr key={ order._id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border-b">{order._id}</td>
                <td className="px-4 py-2 border-b">{order.amount.toLocaleString()} تومان</td>
                <td className="px-4 py-2 border-b">
                <span className={`inline-block px-3 py-1 rounded-full text-sm ${getStatusColor(order.paymentStatus, "orderStatuses")}`}>
                {getStatusLabel(order.paymentStatus, "orderStatuses")}
                </span>
</td>
                <td className="px-4 py-2 border-b">
                    {new Date(order.createdAt).toLocaleDateString("fa-IR")}
                </td>
                <td className="px-4 py-2 border-b">
                <a href={`/user/order/${order._id}`} className="text-blue-500 hover:underline">
    مشاهده
                </a>
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
            ))}
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
    )}
    </div>
);
}


// function getStatusLabel(status, type = "orderStatuses") {
// const statusConfig = {
//     orderStatuses: [
//     { value: "pending", label: "در انتظار", color: "bg-yellow-100 text-yellow-800" },
//     { value: "paid", label: "پرداخت شده", color: "bg-green-100 text-green-800" },
//     { value: "failed", label: "ناموفق", color: "bg-red-100 text-red-800" },
//     { value: "canceled", label: "لغو شده", color: "bg-gray-100 text-gray-800" },
//     ],
// };

// const item = statusConfig[type].find((s) => s.value === status);
// return item ? item.label : "ناشناخته";
// }

// function getStatusColor(status, type = "orderStatuses") {
// const statusConfig = {
//     orderStatuses: [
//     { value: "pending", label: "در انتظار", color: "bg-yellow-100 text-yellow-800" },
//     { value: "paid", label: "پرداخت شده", color: "bg-green-100 text-green-800" },
//     { value: "failed", label: "ناموفق", color: "bg-red-100 text-red-800" },
//     { value: "canceled", label: "لغو شده", color: "bg-gray-100 text-gray-800" },
//     ],
// };

// const item = statusConfig[type].find((s) => s.value === status);
// return item ? item.color : "bg-gray-100 text-gray-800";
// }