import React, { useEffect, useState } from "react";
import axios from "axios";
import DeletePersistentNotificationModal from "../components/DeletePersistentNotificationModal";
export default function GlobalNotificationsPage() {
const [notifications, setNotifications] = useState([]);
const [showDeleteModal, setShowDeleteModal] = useState(false);
const [selectedNotificationId, setSelectedNotificationId] = useState(null);
const [loading, setLoading] = useState(true);

const handleDeleteClick = (id) => {
    setSelectedNotificationId(id);
    setShowDeleteModal(true);
};

useEffect(() => {
    const fetchGlobalNotifications = async () => {
    try {
        const token = localStorage.getItem("adminToken");
        const res = await axios.get("http://localhost:5000/api/admin/notifications/global", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        });
        setNotifications(res.data.data || []);
    } catch (err) {
        console.error(err);
    } finally {
        setLoading(false);
    }
    };

    fetchGlobalNotifications();
}, [notifications, setNotifications, setLoading]);

const handleDeleteConfirm = (id) => {
    // حذف اعلان از لیست محلی
    setNotifications(notifications.filter((n) => n._id !== id));
    alert("اعلان دائمی با موفقیت حذف شد.");
};


return (
    <div className="container py-10 mx-auto">
    <h2 className="mb-6 text-3xl font-bold">اعلان‌های عمومی</h2>

      {/* لیست اعلان‌ها */}
    <div className="overflow-hidden bg-white rounded shadow">
        {loading ? (
        <p className="p-6 text-center">در حال بارگذاری...</p>
        ) : notifications.length === 0 ? (
        <p className="p-6 text-center text-gray-500">هیچ اعلانی یافت نشد.</p>
        ) : (
        <table className="min-w-full">
            <thead className="bg-gray-100">
            <tr>
                <th className="px-4 py-2 text-left border-b">عنوان</th>
                <th className="px-4 py-2 text-left border-b">محتوا</th>
                <th className="px-4 py-2 text-left border-b">نوع</th>
                <th className="px-4 py-2 text-left border-b">تاریخ</th>
            </tr>
            </thead>
            <tbody>
            {notifications.map((notification, index) => (
                <tr key={index} className="hover:bg-gray-50">
                <td className="px-4 py-2 border-b">{notification.title}</td>
                <td className="px-4 py-2 border-b">{notification.message}</td>
                <td className="px-4 py-2 border-b">
                    <span
                    className={`inline-block px-2 py-1 rounded text-xs ${getNotificationColor(notification.type)}`}
                    >
                    {getNotificationLabel(notification.type)}
                    </span>
                </td>
                <td className="px-4 py-2 border-b">
                    {new Date(notification.createdAt).toLocaleString("fa-IR")}
                </td>
                
                <td className="px-4 py-2 border-b">
                <button
                    onClick={() => handleDeleteClick(notification._id)}
                    className="text-red-500 hover:underline"
                >
                    حذف
                </button>
                </td>
                
                </tr>
            ))}
            </tbody>
        </table>
        )}
    </div>
        {/* مدال حذف */}
    <DeletePersistentNotificationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        notificationId={selectedNotificationId}
        onConfirm={handleDeleteConfirm}
    />
    </div>
);
}

// توابع رنگ و برچسب نوع اعلان
function getNotificationLabel(type) {
const labels = {
    info: "اطلاعات",
    warning: "هشدار",
    success: "موفقیت",
    danger: "اخطار",
};
return labels[type] || type;
}

function getNotificationColor(type) {
const colors = {
    info: "bg-blue-100 text-blue-800",
    warning: "bg-yellow-100 text-yellow-800",
    success: "bg-green-100 text-green-800",
    danger: "bg-red-100 text-red-800",
};
return colors[type] || "bg-gray-100 text-gray-800";
}