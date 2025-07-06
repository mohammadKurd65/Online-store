import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getStatusColor, getStatusLabel} from "../utils/statusManager";

export default function AdminUserManagementPage() {
const navigate = useNavigate();
const [users, setUsers] = useState([]);
const [loading, setLoading] = useState(true);
const [searchTerm, setSearchTerm] = useState("");

  // مدال‌ها
const [showDeleteModal, setShowDeleteModal] = useState(false);
const [selectedUser, setSelectedUser] = useState(null);

useEffect(() => {
    const fetchUsers = async () => {
    try {
        const token = localStorage.getItem("adminToken");
        const res = await axios.get(`http://localhost:5000/api/admin/users`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        });
        setUsers(res.data.data || []);
    } catch (err) {
        console.error(err);
    } finally {
        setLoading(false);
    }
    };

    fetchUsers();
}, []);

const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
};

const handleDeleteConfirm = async () => {
    try {
    const token = localStorage.getItem("adminToken");
    await axios.delete(`http://localhost:5000/api/admin/users/${selectedUser._id}`, {
        headers: {
        Authorization: `Bearer ${token}`,
        },
    });

    setUsers(users.filter((u) => u._id !== selectedUser._id));
    setShowDeleteModal(false);
    } catch (err) {
    alert("خطا در حذف کاربر.");
    console.error(err);
    }
};

const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
);

return (
    <div className="container py-10 mx-auto">
    <h2 className="mb-6 text-3xl font-bold">مدیریت کاربران</h2>

      {/* جستجو */}
    <div className="flex items-center justify-between mb-6">
        <input
        type="text"
        placeholder="جستجوی نام کاربری..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full px-4 py-2 border rounded md:w-1/2"
        />
        <button
        onClick={() => navigate("/admin/add-user")}
        className="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600"
        >
        افزودن کاربر
        </button>
    </div>

      {/* لیست کاربران */}
    <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded shadow">
        <thead className="bg-gray-100">
            <tr>
            <th className="px-4 py-2 text-left border-b">نام کاربری</th>
            <th className="px-4 py-2 text-left border-b">نقش</th>
            <th className="px-4 py-2 text-left border-b">وضعیت</th>
            <th className="px-4 py-2 text-left border-b">عملیات</th>
            </tr>
        </thead>
        <tbody>
            {filteredUsers.length === 0 ? (
            <tr>
                <td colSpan="4" className="py-4 text-center">
                کاربری یافت نشد.
                </td>
            </tr>
            ) : (
            filteredUsers.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border-b">{user.username}</td>
                <td className="px-4 py-2 capitalize border-b">{user.role}</td>
                <td className="px-4 py-2 border-b">
                    <span className={`inline-block px-3 py-1 rounded-full text-sm ${getStatusColor(user.role, "userRoles")}`}>
                    {getStatusLabel(user.role, "userRoles")}
                    </span>
                </td>
                <td className="flex px-4 py-2 space-x-2 space-x-reverse border-b">
                    <button
                    onClick={() => navigate(`/admin/edit-user/${user._id}`)}
                    className="text-blue-500 hover:underline"
                    >
                    ویرایش
                    </button>
                    <button
                    onClick={() => handleDeleteClick(user)}
                    className="text-red-500 hover:underline"
                    >
                    حذف
                    </button>
                </td>
                </tr>
            ))
            )}
        </tbody>
        </table>
    </div>

      {/* مدال حذف */}
    {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="w-full max-w-md p-6 bg-white rounded shadow-lg">
            <h3 className="mb-4 text-lg font-semibold">حذف کاربر</h3>
            <p className="mb-6">آیا مطمئن هستید؟ این عمل غیرقابل بازگشت است.</p>
            <div className="flex justify-end space-x-4 space-x-reverse">
            <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
                لغو
            </button>
            <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
            >
                حذف
            </button>
            </div>
        </div>
        </div>
    )}
    </div>
);
}

