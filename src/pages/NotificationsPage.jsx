import React, { useEffect, useState, useNavigate } from "react";
import axios from "axios";

export default function NotificationsPage() {
const [notifications, setNotifications] = useState([]);
const navigate = useNavigate();

useEffect(() => {
    const fetchNotifications = async () => {
    try {
        const token = localStorage.getItem("adminToken");
        const res = await axios.get("http://localhost:5000/api/admin/notifications", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        });
        setNotifications(res.data.data || []);
    } catch (err) {
        console.error(err);
    }
    };

    fetchNotifications();
}, []);

const markAsRead = async (id) => {
    try {
    const token = localStorage.getItem("adminToken");
    await axios.put(`http://localhost:5000/api/admin/notifications/read/${id}`, {}, {
        headers: {
        Authorization: `Bearer ${token}`,
        },
    });

    setNotifications(notifications.map((n) =>
        n._id === id ? { ...n, read: true } : n
    ));
    } catch (err) {
    alert("خطا در خواندن اعلان.");
    console.error(err);
    }
};

const markAllAsRead = async () => {
    try {
    const token = localStorage.getItem("adminToken");
    await axios.put("http://localhost:5000/api/admin/notifications/read-all", {}, {
        headers: {
        Authorization: `Bearer ${token}`,
        },
    });

    setNotifications(notifications.map((n) => ({ ...n, read: true })));
    } catch (err) {
    alert("خطا در خواندن تمام اعلان‌ها.");
    console.error(err);
    }
};

return (
    <div className="container py-10 mx-auto">
    <h2 className="mb-6 text-3xl font-bold">اعلان‌ها</h2>

      {/* دکمه خواندن همه */}
    <div className="mb-4 text-right">
        <button
        onClick={markAllAsRead}
        className="text-sm text-blue-500 hover:underline"
        >
        علامت زدن همه به عنوان خوانده شده
        </button>
    </div>

      {/* لیست اعلان‌ها */}
    <div className="bg-white rounded shadow">
        {notifications.length === 0 ? (
        <p className="p-6 text-center text-gray-500">هیچ اعلانی وجود ندارد.</p>
        ) : (
        notifications.map((notifications, index) => (
            <div
            key={index}
            className={`border-b last:border-b-0 px-4 py-3 ${
                notifications.read ? "bg-gray-50" : "bg-blue-50"
            }`}
            >
            <div className="flex justify-between">
                <h3 className="font-semibold">{notifications.title}</h3>
                {!notifications.read && (
                <button
                    onClick={() => markAsRead(notifications._id)}
                    className="text-xs text-blue-500 hover:underline"
                >
                    خواندن
                </button>
                )}
            </div>
            <p className="mt-1 text-sm">{notifications.message}</p>
            {notifications.actionUrl && (
                <a
                href={notifications.actionUrl}
                className="inline-block mt-2 text-sm text-blue-500 hover:underline"
                >
                مشاهده جزئیات
                </a>
            )}
            </div>
        ))
        )}
    </div>
    </div>
);
}