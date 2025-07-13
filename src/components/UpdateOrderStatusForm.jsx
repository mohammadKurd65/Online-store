import React, { useState } from "react";
import axios from "axios";
import { decodeToken } from "../utils/jwtDecode";

export default function UpdateOrderStatusForm({ orderId, currentStatus, onUpdate }) {
const [status, setStatus] = useState(currentStatus);
const [loading, setLoading] = useState(false);
const token = localStorage.getItem("userToken");
const decoded = decodeToken(token);
const userRole = decoded?.role;

if (userRole !== "admin") {
  return null; // یا یک پیام دسترسی غیرمجاز
}
const handleUpdate = async () => {
    setLoading(true);
    try {
    const token = localStorage.getItem("adminToken");
    const res = await axios.put(
        `http://localhost:5000/api/orders/orders/${orderId}/status`,
        { paymentStatus: status },
        {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        }
    );
    onUpdate(res.data.data);
    } catch (err) {
    alert("خطا در آپدیت وضعیت.");
    console.error(err);
    } finally {
    setLoading(false);
    }
};

return (
    <div className="flex items-center space-x-2 space-x-reverse">
    <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        disabled={loading}
        className={`border rounded px-3 py-1 text-sm ${loading ? "opacity-70" : ""}`}
    >
        <option value="pending">در انتظار</option>
        <option value="paid">پرداخت شده</option>
        <option value="failed">ناموفق</option>
        <option value="canceled">لغو شده</option>
    </select>
    <button
        onClick={handleUpdate}
        disabled={loading}
        className={`bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
    >
        {loading ? "در حال ذخیره..." : "ذخیره"}
    </button>
    </div>
);
}