import React, { useState, useEffect } from "react";
import axios from "axios";

export default function NotificationBell() {
const [showDropdown, setShowDropdown] = useState(false);
const [notifications, setNotifications] = useState([]);
const unreadCount = notifications.filter((n) => !n.read).length;

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

return (
    <div className="relative">
    <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="relative p-2 text-gray-600 hover:text-blue-600"
    >
        <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-4.217A2 2 0 0017.405 11H7.21a2 2 2 0 00-1.991 1.817L2.167 4.645a2 2 2 0 00-.167 1.991z"
        />
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 3h2l.447.67a7.001 7.001 0 0010.106 0L16 3H3z"
        />
        </svg>
        {unreadCount > 0 && (
        <span className="absolute top-0 right-0 flex items-center justify-center w-5 h-5 text-xs text-white bg-red-500 rounded-full">
            {unreadCount}
        </span>
        )}
    </button>

      {/* منوی اعلان‌ها */}
    {showDropdown && (
        <div className="absolute right-0 z-50 mt-2 overflow-y-auto bg-white border rounded shadow-lg w-80 max-h-96">
        <div className="p-4 font-semibold">اعلان‌ها</div>
        <ul>
            {notifications.length === 0 ? (
            <li className="px-4 py-2 text-gray-500">هیچ اعلانی وجود ندارد.</li>
            ) : (
            notifications.map((notification, index) => (
                <li
                key={index}
                className={`px-4 py-2 border-b hover:bg-gray-100 ${
                    notification.read ? "text-gray-500" : "font-bold text-blue-600"
                }`}
                >
                <strong>{notification.title}</strong>
                <p className="text-sm">{notification.message}</p>
                <a href={notification.actionUrl} className="text-sm text-blue-500 underline">
                    مشاهده
                </a>
                </li>
            ))
            )}
        </ul>
        <div className="p-2 text-center">
            <a href="/admin/notifications" className="text-sm text-blue-500 hover:underline">
            مشاهده همه اعلان‌ها
            </a>
        </div>
        </div>
    )}
    </div>
);
}