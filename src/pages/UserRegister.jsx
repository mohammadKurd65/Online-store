import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useEffect } from "react-router-dom";
import { decodeToken } from "../utils/jwtDecode";

export default function UserRegister() {
    const token = localStorage.getItem("userToken");
const decoded = decodeToken(token);
const userRole = decoded?.role;
const [username, setUsername] = useState("");
const [password, setPassword] = useState("");
const [confirmPassword, setConfirmPassword] = useState("");
const [error, setError] = useState("");
const navigate = useNavigate();


useEffect(() => {
if (userRole !== "admin") {
    navigate("/unauthorized");
}
}, [userRole, navigate]);
const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
    setError("رمز عبور و تأیید رمز مطابقت ندارند.");
    return;
    }

    try {
    const res = await axios.post("http://localhost:5000/api/user/register", {
        username,
        password,
    });

      // ذخیره توکن در localStorage
    localStorage.setItem("userToken", res.data.token);
    alert("ثبت‌نام موفقیت‌آمیز بود!");
    navigate("/user/login");
    } catch (err) {
    setError(err.response?.data?.message || "خطایی رخ داده است.");
    }
};

return (
    <div className="container py-10 mx-auto">
    <h2 className="mb-6 text-2xl font-bold">ثبت‌نام کاربر</h2>
    {error && <p className="mb-4 text-red-500">{error}</p>}
    <form onSubmit={handleRegister} className="max-w-md mx-auto">
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
        <div className="mb-4">
        <label className="block mb-2 text-gray-700">تأیید رمز عبور</label>
        <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
        />
        </div>
        <button
        type="submit"
        className="w-full px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600"
        >
        ثبت‌نام
        </button>
    </form>
    </div>
);
}