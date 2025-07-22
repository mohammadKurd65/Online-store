import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
export default function PersistentNotificationLogsPage() {
const [logs, setLogs] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
    const fetchLogs = async () => {
    try {
        const token = localStorage.getItem("adminToken");
        const res = await axios.get("http://localhost:5000/api/admin/notifications/logs", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        });
        setLogs(res.data.logs || []);
    } catch (err) {
        console.error(err);
    } finally {
        setLoading(false);
    }
    };

    fetchLogs();
}, [ setLogs, setLoading]);

return (
    <div className="container py-10 mx-auto">
    <h2 className="mb-6 text-3xl font-bold">لاگ اعلان‌های دائمی</h2>

      {/* جدول لاگ‌ها */}
    <div className="overflow-x-auto bg-white rounded shadow">
        {loading ? (
        <p className="p-6 text-center">در حال بارگذاری...</p>
        ) : logs.length === 0 ? (
        <p className="p-6 text-center text-gray-500">هیچ لاگی وجود ندارد.</p>
        ) : (
        <table className="min-w-full">
            <thead className="bg-gray-100">
            <tr>
                <th className="px-4 py-2 text-left border-b">عملیات</th>
                <th className="px-4 py-2 text-left border-b">ادمین</th>
                <th className="px-4 py-2 text-left border-b">شرح</th>
                <th className="px-4 py-2 text-left border-b">زمان</th>
            </tr>
            </thead>
            <tbody>
            {logs.map((log, index) => (
                <tr key={index} className="hover:bg-gray-50">
<td className="px-4 py-2 capitalize border-b">{getActionLabel(log.action)}</td>
<td className="px-4 py-2 border-b">{log.admin?.username || "ناشناس"}</td>
<td className="px-4 py-2 border-b">{log.description || "-"}</td>
<td className="px-4 py-2 border-b">
    {new Date(log.createdAt).toLocaleString("fa-IR")}
</td>
<td className="px-4 py-2 border-b">
    <Link to={`/admin/notifications/logs/${log._id}`} className="text-blue-500 hover:underline">
    مشاهده جزئیات
    </Link>
</td>
</tr>
            ))}
            
            </tbody>
        </table>
        )}
    </div>
    </div>
);
}

function getActionLabel(action) {
const labels = {
    create: "ایجاد",
    update: "ویرایش",
    delete: "حذف",
    activate: "فعال‌سازی",
    deactivate: "غیرفعال‌سازی",
};
return labels[action] || action;
}