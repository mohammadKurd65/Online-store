import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSocket } from "../hooks/useSocket";
import { decodeToken } from "../utils/jwtDecode";
import { io } from "socket.io-client";

export default function NotificationBell() {
const token = localStorage.getItem("adminToken");
const decoded = decodeToken(token);
const adminId = decoded?.id || "";

const { notifications, setNotifications } = useSocket(adminId);

const [showDropdown, setShowDropdown] = useState(false);
const unreadCount = notifications.filter((n) => !n.read).length;
const [settings, setSettings] = useState({
    enableSound: true,
    enableNotifications: true,
    enableEmail: false,
});

  // دریافت اعلان‌های قبلی
useEffect(() => {
    const fetchNotifications = async () => {
    try {
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

    if (adminId) {
    fetchNotifications();
    }
}, [adminId, token, setNotifications]);

  // وقتی یک اعلان جدید دریافت شد
useEffect(() => {
    if (notifications.length > 0 && settings.enableSound) {
    const audio = new Audio("/sounds/notification.mp3");
    audio.play();
    }
}, [notifications, settings.enableSound]);

useEffect(() => {
const socket = io("http://localhost:5000", {
    auth: {
    adminId,
    },
});

socket.on("new-global-notification", (notification) => {
    setNotifications((prev) => [notification, ...prev]);
    if (settings.enableSound) {
    const audio = new Audio("/sounds/notification.mp3");
    audio.play();
    }
});

return () => socket.disconnect();
}, [adminId, setNotifications, settings.enableSound]);

return (
    <div className="relative">
    <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="relative p-2 text-gray-600 hover:text-blue-600"
    >
        {/* آیکون */}
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
        <path
            d="M12 22a2 2 0 0 0 2-2h-4a2 2 0 0 0 2 2Zm6-6V11a6 6 0 1 0-12 0v5l-2 2v1h16v-1l-2-2Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
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
                {notification.actionUrl ? (
                    <a
                    href={notification.actionUrl}
                    className="text-sm text-blue-500 underline"
                    target="_blank"
                    rel="noopener noreferrer"
                    >
                    مشاهده
                    </a>
                ) : null}
                </li>
            ))
            )}
        </ul>
        <div className="p-2 text-center">
            <a href="/admin/notifications" className="text-sm text-blue-500 hover:underline">
            مشاهده همه
            </a>
        </div>
        </div>
    )}
    </div>
);
}