import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { decodeToken } from "../utils/jwtDecode";
import HasPermission from "../components/HasPermission";
import { usePermission } from "../hooks/usePermission";
export default function AdminEditUserPage() {
    const { canDeleteUsers } = usePermission();

if (canDeleteUsers) {
  // نمایش دکمه حذف
}
const { id } = useParams();
const navigate = useNavigate();
const [user, setUser] = useState({
    username: "",
    role: "user",
    status: "active",
});
const [accessDenied, setAccessDenied] = useState(false);

const token = localStorage.getItem("userToken");
const decoded = decodeToken(token);
const userRole = decoded?.role;

useEffect(() => {
if (userRole !== "admin") {
    navigate("/unauthorized");
}
}, [userRole, navigate]);

useEffect(() => {
    if (userRole !== "admin") {
    setAccessDenied(true);
    return;
    }
    const fetchUser = async () => {
    try {
        const res = await axios.get(`http://localhost:5000/api/admin/users/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        });
        setUser(res.data.data);
    } catch (err) {
        alert("خطا در دریافت اطلاعات کاربر.");
        navigate("/admin/users");
    }
    };
    fetchUser();
}, [id, navigate, token, userRole]);

const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
};

const handleSubmit = async (e) => {
    e.preventDefault();
    try {
    const res = await axios.put(`http://localhost:5000/api/admin/users/${id}`, user, {
        headers: {
        Authorization: `Bearer ${token}`,
        },
    });
    if (res.status !== 200) {
        throw new Error("خطا در بروزرسانی کاربر.");
    }
    setUser(res.data.data);
    alert("کاربر با موفقیت آپدیت شد.");
    navigate("/admin/users");
    } catch (err) {
    alert("خطا در ذخیره تغییرات.");
    console.error(err);
    }
};

if (accessDenied) {
    return (
    <div className="container py-10 mx-auto text-center text-red-600">
        دسترسی غیرمجاز! فقط ادمین می‌تواند این صفحه را مشاهده کند.
    </div>
    );
}

return (
    <div className="container py-10 mx-auto">
    <h2 className="mb-6 text-2xl font-bold">ویرایش کاربر</h2>
    <form onSubmit={handleSubmit} className="max-w-md p-6 mx-auto bg-white rounded shadow">
        <div className="mb-4">
        <label className="block mb-2 text-gray-700">نام کاربری</label>
        <input
            type="text"
            name="username"
            value={user.username}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
        />
        </div>
        <div className="mb-4">
        <label className="block mb-2 text-gray-700">نقش</label>
        <select
            name="role"
            value={user.role}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
        >
            <option value="user">کاربر عادی</option>
            <option value="editor">ویرایشگر</option>
            <option value="admin">ادمین</option>
        </select>
        </div>
        <div className="mb-4">
        <label className="block mb-2 text-gray-700">وضعیت</label>
        <select
            name="status"
            value={user.status}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
        >
            <option value="active">فعال</option>
            <option value="inactive">غیرفعال</option>
            <option value="blocked">مسدود</option>
        </select>
        </div>
        <div className="flex justify-between">
        <button
            type="submit"
            className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
        >
            ذخیره تغییرات
        </button>
        <button
            type="button"
            onClick={() => navigate("/admin/users")}
            className="px-4 py-2 text-white bg-gray-500 rounded hover:bg-gray-600"
        >
            انصراف
        </button>
        </div>
    </form>
    <HasPermission permission="delete_users">
        <button className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600">
            حذف کاربران
        </button>
        </HasPermission>
    </div>
);
}