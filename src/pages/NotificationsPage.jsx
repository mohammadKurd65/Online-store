import React, { useEffect, useState, useNavigate } from "react";
import axios from "axios";
import BroadcastNotificationModal from "../components/BroadcastNotificationModal";
import GlobalNotificationModal from "../components/GlobalNotificationModal";
export default function NotificationsPage() {
const [notifications, setNotifications] = useState([]);
const [showBroadcastModal, setShowBroadcastModal] = useState(false);
const [showGlobalModal, setShowGlobalModal] = useState(false);
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

    <div className="flex justify-between mb-6">
        <button
            onClick={() => setShowBroadcastModal(true)}
            className="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600"
        >
            ارسال دستی اعلان
        </button>

        <button
            onClick={() => setShowGlobalModal(true)}
            className="px-4 py-2 text-white bg-indigo-500 rounded hover:bg-indigo-600"
        >
            ارسال اعلان عمومی
        </button>

        {/* مدال‌ها */}
        <BroadcastNotificationModal
        isOpen={showBroadcastModal}
        onClose={() => setShowBroadcastModal(false)}
        />

        <GlobalNotificationModal
        isOpen={showGlobalModal}
        onClose={() => setShowGlobalModal(false)}
        />
        </div>

    

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
    {notifications.map((notification, index) => (
<div
    key={index}
    className={`border-b last:border-b-0 px-4 py-3 ${
    notification.read ? "bg-gray-50" : "bg-blue-50"
    }`}
>
    <div className="flex justify-between">
    <h3 className="font-semibold">{notification.title}</h3>
    {!notification.read && (
        <button
        onClick={() => markAsRead(notification._id)}
        className="text-xs text-blue-500 hover:underline"
        >
        خواندن
        </button>
    )}
    </div>
    <p className="mt-1 text-sm">{notification.message}</p>
    {notification.actionUrl && (
    <a
        href={notification.actionUrl}
        className="inline-block mt-2 text-sm text-blue-500 hover:underline"
    >
        مشاهده جزئیات
    </a>
    )}
</div>
))}
    </div>
    </div>
);
};

