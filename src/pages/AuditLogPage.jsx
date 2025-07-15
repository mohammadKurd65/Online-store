import React, { useEffect, useState } from "react";
import axios from "axios";


const actionLabels = {
login: "ورود به داشبورد",
logout: "خروج از داشبورد",
create_user: "افزودن کاربر",
delete_user: "حذف کاربر",
update_user: "ویرایش کاربر",
create_product: "افزودن محصول",
update_product: "ویرایش محصول",
delete_product: "حذف محصول",
update_permissions: "ویرایش دسترسی‌ها",
manage_orders: "مدیریت سفارشات",
edit_settings: "ویرایش تنظیمات",
};
export default function AuditLogPage() {
const [logs, setLogs] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
    const fetchLogs = async () => {
    try {
        const token = localStorage.getItem("adminToken");
        const res = await axios.get("http://localhost:5000/api/admin/logs", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        });
        setLogs(res.data.data || []);
    } catch (err) {
        console.error(err);
    } finally {
        setLoading(false);
    }
    };

    fetchLogs();
}, []);

if (loading) return <p>در حال بارگذاری...</p>;

return (
    <div className="container py-10 mx-auto">
    <h2 className="mb-6 text-3xl font-bold">ثبت‌نامه‌های ادمین</h2>

    {/* جدول لاگ‌ها */}
<div className="overflow-x-auto">
<table className="min-w-full bg-white border rounded shadow">
    <thead className="bg-gray-100">
    <tr>
        <th className="px-4 py-2 text-left border-b">عملیات</th>
        <th className="px-4 py-2 text-left border-b">نوع آیتم</th>
        <th className="px-4 py-2 text-left border-b">شرح</th>
        <th className="px-4 py-2 text-left border-b">زمان</th>
        <th className="px-4 py-2 text-left border-b">IP</th>
    </tr>
    </thead>
    <tbody>
    {logs.length === 0 ? (
        <tr>
        <td colSpan="5" className="py-4 text-center">هیچ لاگی یافت نشد.</td>
        </tr>
    ) : (
        logs.map((log, index) => (
        <tr key={index} className="hover:bg-gray-50">
            {/* ✅ اینجا استفاده میکنیم */}
            <td className="px-4 py-2 border-b">{actionLabels[log.action] || log.action}</td>
            <td className="px-4 py-2 capitalize border-b">{log.entityType}</td>
            <td className="px-4 py-2 border-b">{log.description}</td>
            <td className="px-4 py-2 border-b">
            {new Date(log.createdAt).toLocaleString("fa-IR")}
            </td>
            <td className="px-4 py-2 border-b">{log.ip}</td>
            <td className="px-4 py-2 border-b">{actionLabels[log.action] || log.action}</td>
        </tr>
        ))
    )}
    </tbody>
</table>
</div>
    </div>
);
}