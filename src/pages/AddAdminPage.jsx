import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useToast } from "../context/ToastContext";

export default function AddAdminPage() {
    const { showToast } = useToast(); // ✅ استفاده از Toast
const [username, setUsername] = useState("");
const [password, setPassword] = useState("");
const [error, setError] = useState("");
const navigate = useNavigate();

const handleAddAdmin = async (e) => {
    e.preventDefault();

    try {
    const token = localStorage.getItem("adminToken");
    const res = await axios.post(
        "http://localhost:5000/api/admin/admins",
        { username, password },
        {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        }
    );

      showToast("ادمین با موفقیت اضافه شد.", "success"); // ✅ نمایش نوتیفیکیشن
    navigate("/admin/users");
    } catch (err) {
    const errorMessage = err.response?.data?.message || "خطایی رخ داده است.";
    setError(errorMessage);
      showToast(errorMessage, "error"); // ✅ نمایش خطا
    }
};

return (
    <div className="container py-10 mx-auto">
    <h2 className="mb-6 text-2xl font-bold">افزودن ادمین جدید</h2>
    {error && <p className="mb-4 text-red-500">{error}</p>}
    <form onSubmit={handleAddAdmin} className="max-w-md mx-auto">
        <div className="mb-4">
        <label className="block mb-2 text-gray-700">نام کاربری</label>
        <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
        />
        </div>
        <div className="mb-4">
        <label className="block mb-2 text-gray-700">رمز عبور</label>
        <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
        />
        </div>
        <button
        type="submit"
        className="w-full px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600"
        >
        افزودن ادمین
        </button>
    </form>
    </div>
);
}