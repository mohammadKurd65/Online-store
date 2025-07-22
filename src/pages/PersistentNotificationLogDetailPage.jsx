import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

export default function PersistentNotificationLogDetailPage() {
const { id } = useParams();
const [log, setLog] = useState(null);
const [loading, setLoading] = useState(true);

useEffect(() => {
    const fetchLog = async () => {
    try {
        const token = localStorage.getItem("adminToken");
        const res = await axios.get(`http://localhost:5000/api/admin/notifications/logs/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        });
        setLog(res.data.log);
    } catch (err) {
        alert("خطا در دریافت اطلاعات لاگ.");
        console.error(err);
    } finally {
        setLoading(false);
    }
    };

fetchLog();
}, [id, setLog, setLoading]);

if (loading) return <p>در حال بارگذاری...</p>;
if (!log) return <p>لاگ یافت نشد.</p>;

return (
    <div className="container py-10 mx-auto">
    <h2 className="mb-6 text-3xl font-bold">جزئیات لاگ</h2>

    <div className="p-6 space-y-6 bg-white rounded shadow">
        {/* عملیات */}
        <div>
        <label className="block mb-1 font-semibold text-gray-700">عملیات</label>
        <p className={`font-medium px-3 py-1 rounded inline-block ${
            log.action === "create" ? "bg-green-100 text-green-800" :
            log.action === "update" ? "bg-blue-100 text-blue-800" :
            log.action === "delete" ? "bg-red-100 text-red-800" :
            "bg-gray-100 text-gray-800"
        }`}>
            {getActionLabel(log.action)}
        </p>
        </div>

        {/* ادمین */}
        <div>
        <label className="block mb-1 font-semibold text-gray-700">ادمین</label>
        <p>{log.admin?.username || "ناشناس"}</p>
        </div>

        {/* شرح */}
        <div>
        <label className="block mb-1 font-semibold text-gray-700">شرح</label>
        <p>{log.description || "-"}</p>
        </div>

        {/* زمان */}
        <div>
        <label className="block mb-1 font-semibold text-gray-700">زمان</label>
        <p>{new Date(log.createdAt).toLocaleString("fa-IR")}</p>
        </div>

        {/* IP و User Agent */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
            <label className="block mb-1 font-semibold text-gray-700">IP آدرس</label>
            <p className="font-mono">{log.ip}</p>
        </div>
        <div>
            <label className="block mb-1 font-semibold text-gray-700">مرورگر</label>
            <p className="text-sm">{log.userAgent}</p>
        </div>
        </div>

        {/* داده قبلی (برای update) */}
        {log.previousData && (
        <div>
            <label className="block mb-1 font-semibold text-gray-700">داده قبلی</label>
            <pre className="p-4 overflow-x-auto text-sm bg-gray-100 rounded">
            {JSON.stringify(log.previousData, null, 2)}
            </pre>
        </div>
        )}

        {/* داده جدید (برای create/update) */}
        {log.newData && (
        <div>
            <label className="block mb-1 font-semibold text-gray-700">داده جدید</label>
            <pre className="p-4 overflow-x-auto text-sm rounded bg-blue-50">
            {JSON.stringify(log.newData, null, 2)}
            </pre>
        </div>
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