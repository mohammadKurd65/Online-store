import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "../firebase";
import { useNavigate } from "react-router-dom";

export default function Register() {
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [error, setError] = useState("");
const navigate = useNavigate();

const handleRegister = async (e) => {
    e.preventDefault();
    try {
    await createUserWithEmailAndPassword(email, password);
    navigate("/");
    } catch (err) {
    setError("ثبت‌نام با خطا مواجه شد. لطفاً دوباره تلاش کنید.");
    }
};

return (
    <div className="container py-10 mx-auto">
    <h2 className="mb-4 text-2xl font-bold">ثبت‌نام</h2>
    {error && <p className="text-red-500">{error}</p>}
    <form onSubmit={handleRegister} className="max-w-md mx-auto">
        <div className="mb-4">
        <label className="block mb-2 text-gray-700">نام کامل</label>
        <input type="text" className="w-full px-3 py-2 border rounded" />
        </div>
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
        <button type="submit" className="w-full px-4 py-2 text-white bg-green-500 rounded">
        ثبت‌نام
        </button>
    </form>
    </div>
);
}