import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { decodeToken } from "../utils/jwtDecode";
import HasPermission from "../components/HasPermission";
import { usePermission } from "../hooks/usePermission";
export default function AdminLogin() {
    const { canDeleteUsers } = usePermission();

if (canDeleteUsers) {
  // نمایش دکمه حذف
}
const [username, setUsername] = useState("");
const [password, setPassword] = useState("");
const [error, setError] = useState("");
const navigate = useNavigate();
const token = localStorage.getItem("userToken");
const decoded = decodeToken(token);
const userRole = decoded?.role;

useEffect(() => {
if (userRole !== "admin") {
    navigate("/unauthorized");
}
}, [userRole, navigate]);
const handleLogin = async (e) => {
    e.preventDefault();

    try {
    const res = await axios.post("http://localhost:5000/api/admin/login", {
        username,
        password,
    });

    localStorage.setItem("adminToken", res.data.token);
    navigate("/admin/orders");
    } catch (err) {
    setError(err.response?.data?.message || "خطایی رخ داده است.");
    }
};

return (
    <div className="container py-10 mx-auto">
    <h2 className="mb-4 text-2xl font-bold">ورود ادمین</h2>
    {error && <p className="text-red-500">{error}</p>}
    <form onSubmit={handleLogin} className="max-w-md mx-auto">
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
        <button type="submit" className="w-full px-4 py-2 text-white bg-blue-500 rounded">
        ورود
        </button>
    </form>
    <HasPermission permission="delete_users">
        <button className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600">
            حذف کاربران
        </button>
        </HasPermission>
    </div>
);
}