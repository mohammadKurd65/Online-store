import React, { useEffect, useState } from "react";
import axios from "axios";
import AddPersistentNotificationModal from "../components/AddPersistentNotificationModal";
import EditPersistentNotificationModal from "../components/EditPersistentNotificationModal";
import DeletePersistentNotificationModal from "../components/DeletePersistentNotificationModal";

export default function PersistentNotificationManagerPage() {
const [notifications, setNotifications] = useState([]);
const [loading, setLoading] = useState(true);

  // مدال‌ها
const [showAddModal, setShowAddModal] = useState(false);
const [showEditModal, setShowEditModal] = useState(false);
const [showDeleteModal, setShowDeleteModal] = useState(false);
const [selectedNotification, setSelectedNotification] = useState(null);

useEffect(() => {
    fetchNotifications();
}, [ showAddModal, showEditModal, showDeleteModal]);

const fetchNotifications = async () => {
    try {
    const token = localStorage.getItem("adminToken");
    const res = await axios.get("http://localhost:5000/api/admin/notifications/persistent", {
        headers: {
        Authorization: `Bearer ${token}`,
        },
    });
    setNotifications(res.data.notifications || []);
    } catch (err) {
    console.error(err);
    } finally {
    setLoading(false);
    }
};

const handleAddSuccess = (newNotification) => {
    setNotifications([newNotification, ...notifications]);
};

const handleEditSuccess = (updatedNotification) => {
    setNotifications(
    notifications.map((n) => (n._id === updatedNotification._id ? updatedNotification : n))
    );
};

const handleDeleteConfirm = (id) => {
    setNotifications(notifications.filter((n) => n._id !== id));
    alert("اعلان با موفقیت حذف شد.");
};

return (
    <div className="container py-10 mx-auto">
    <h2 className="mb-6 text-3xl font-bold">مدیریت اعلان‌های دائمی</h2>

      {/* دکمه افزودن */}
    <div className="flex justify-end mb-6">
        <button
        onClick={() => setShowAddModal(true)}
        className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
        >
        افزودن اعلان جدید
        </button>
    </div>

      {/* لیست اعلان‌ها */}
    <div className="overflow-hidden bg-white rounded shadow">
        {loading ? (
        <p className="p-6 text-center">در حال بارگذاری...</p>
        ) : notifications.length === 0 ? (
        <p className="p-6 text-center text-gray-500">هیچ اعلان دائمی وجود ندارد.</p>
        ) : (
        <table className="min-w-full">
            <thead className="bg-gray-100">
            <tr>
                <th className="px-4 py-2 text-left border-b">عنوان</th>
                <th className="px-4 py-2 text-left border-b">محتوا</th>
                <th className="px-4 py-2 text-left border-b">نوع</th>
                <th className="px-4 py-2 text-left border-b">وضعیت</th>
                <th className="px-4 py-2 text-left border-b">عملیات</th>
            </tr>
            </thead>
            <tbody>
            {notifications.map((notification) => (
                <tr key={notification._id} className="hover:bg-gray-50">
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
                    <span
                    className={`inline-block px-2 py-1 rounded text-xs ${
                        notification.active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                    }`}
                    >
                    {notification.active ? "فعال" : "غیرفعال"}
                    </span>
                </td>
                <td className="flex px-4 py-2 space-x-2 space-x-reverse border-b">
                    <button
                    onClick={() => {
                        setSelectedNotification(notification);
                        setShowEditModal(true);
                    }}
                    className="text-blue-500 hover:underline"
                    >
                    ویرایش
                    </button>
                    <button
                    onClick={() => {
                        setSelectedNotification(notification);
                        setShowDeleteModal(true);
                    }}
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

      {/* مدال‌ها */}
    <AddPersistentNotificationModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAddSuccess={handleAddSuccess}
    />

    <EditPersistentNotificationModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        notification={selectedNotification}
        onEditSuccess={handleEditSuccess}
    />

    <DeletePersistentNotificationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        notificationId={selectedNotification?._id}
        onConfirm={handleDeleteConfirm}
    />
    </div>
);
}

// 👇 توابع رنگ و برچسب
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