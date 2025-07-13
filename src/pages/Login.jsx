import React, { useState } from "react";
import { signInWithEmailAndPassword } from "../firebase";
import { useNavigate, useEffect } from "react-router-dom";
import { decodeToken } from "../utils/jwtDecode";

export default function Login() {
const [email, setEmail] = useState("");
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
    await signInWithEmailAndPassword(email, password);
    navigate("/");
    } catch (err) {
    setError("ایمیل یا رمز عبور اشتباه است.");
    }
};

return (
    <div className="container py-10 mx-auto">
    <h2 className="mb-4 text-2xl font-bold">ورود به حساب</h2>
    {error && <p className="text-red-500">{error}</p>}
    <form onSubmit={handleLogin} className="max-w-md mx-auto">
        <div className="mb-4">
        <label className="block mb-2 text-gray-700">ایمیل</label>
        <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
    </div>
);
}