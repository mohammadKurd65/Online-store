import React, { useState , useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { decodeToken } from "../utils/jwtDecode";

export default function AdminAddUserPage() {
const navigate = useNavigate();
const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: "user",
    status: "active",
});

const [error, setError] = useState("");

const token = localStorage.getItem("userToken");
const decoded = decodeToken(token);
const userRole = decoded?.role;

useEffect(() => {
if (userRole !== "admin") {
    navigate("/unauthorized");
}
}, [userRole, navigate]);

const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
};

const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password.length < 6) {
    setError("رمز عبور باید حداقل ۶ کاراکتر باشد.");
    return;
    }

    try {
    const token = localStorage.getItem("adminToken");
    const res = await axios.post(
        "http://localhost:5000/api/admin/users",
        formData,
        {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        }
    );
    if (res.status !== 201) {
        setError("خطا در افزودن کاربر.لطفا دوباره تلاش کنید.");
        return;
    }

    alert("کاربر با موفقیت اضافه شد.");
    navigate("/admin/users");
    } catch (err) {
    setError(err.response?.data?.message || "خطا در افزودن کاربر.");
    console.error(err);
    }
};

return (
    <div className="container py-10 mx-auto">
    <h2 className="mb-6 text-2xl font-bold">افزودن کاربر جدید</h2>
    {error && <p className="mb-4 text-red-500">{error}</p>}

    <form onSubmit={handleSubmit} className="max-w-md p-6 mx-auto bg-white rounded shadow">
        {/* نام کاربری */}
        <div className="mb-4">
        <label className="block mb-2 text-gray-700">نام کاربری</label>
        <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
        />
        </div>

        {/* رمز عبور */}
        <div className="mb-4">
        <label className="block mb-2 text-gray-700">رمز عبور</label>
        <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
        />
        </div>

        {/* نقش */}
        <div className="mb-4">
        <label className="block mb-2 text-gray-700">نقش</label>
        <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
        >
            <option value="user">کاربر عادی</option>
            <option value="editor">ویرایشگر</option>
            <option value="admin">ادمین</option>
        </select>
        </div>

        {/* وضعیت */}
        <div className="mb-4">
        <label className="block mb-2 text-gray-700">وضعیت</label>
        <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
        >
            <option value="active">فعال</option>
            <option value="inactive">غیرفعال</option>
            <option value="blocked">مسدود</option>
        </select>
        </div>

        {/* دکمه‌ها */}
        <button
        type="submit"
        className="w-full px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600"
        >
        ذخیره کاربر
        </button>
    </form>
    </div>
);
}