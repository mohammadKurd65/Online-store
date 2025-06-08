import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function UserEditProfilePage() {
const [username, setUsername] = useState("");
const [password, setPassword] = useState("");
const [confirmPassword, setConfirmPassword] = useState("");
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");
const navigate = useNavigate();

useEffect(() => {
    const fetchUserData = async () => {
    try {
        const token = localStorage.getItem("userToken");
        const res = await axios.get("http://localhost:5000/api/user/profile", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        });

        setUsername(res.data.data.username);
    } catch (err) {
        alert("خطا در دریافت اطلاعات.");
        navigate("/user/login");
    } finally {
        setLoading(false);
    }
    };

    fetchUserData();
}, [navigate]);

const handleSave = async () => {
    if (password !== confirmPassword) {
    setError("رمز عبور و تأیید آن مطابقت ندارند.");
    return;
    }

    try {
      const token = localStorage.getItem("userToken");
      await axios.put(
        "http://localhost:5000/api/user/profile",
        { username, password },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("اطلاعات با موفقیت ذخیره شد.");
      navigate("/user/profile");
    } catch (err) {
      setError(err.response?.data?.message || "خطا در ذخیره اطلاعات.");
      console.error(err);
    }
};

if (loading) return <p>در حال بارگذاری...</p>;

return (
    <div className="container py-10 mx-auto">
    <h2 className="mb-6 text-3xl font-bold">تنظیمات پروفایل</h2>
    {error && <p className="mb-4 text-red-500">{error}</p>}
    <form onSubmit={(e) => e.preventDefault()} className="max-w-md mx-auto">
        {/* نام کاربری */}
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

        {/* رمز عبور */}
        <div className="mb-4">
        <label className="block mb-2 text-gray-700">رمز عبور جدید (اختیاری)</label>
        <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded"
        />
        </div>

        {/* تأیید رمز عبور */}
        <div className="mb-4">
        <label className="block mb-2 text-gray-700">تأیید رمز عبور</label>
        <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded"
        />
        </div>

        <button
        onClick={handleSave}
        className="w-full px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
        >
        ذخیره تغییرات
        </button>
    </form>
    </div>
);
}