import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import DeleteAccountModal from "../components/DeleteAccountModal";
import { decodeToken } from "../utils/jwtDecode";
import HasPermission from "../components/HasPermission";
import { usePermission } from "../hooks/usePermission";
export default function UserEditProfilePage() {
    const { canDeleteUsers } = usePermission();

if (canDeleteUsers) {
  // نمایش دکمه حذف
}
    const token = localStorage.getItem("userToken");
const decoded = decodeToken(token);
const userRole = decoded?.role;
const [username, setUsername] = useState("");
const [password, setPassword] = useState("");
const [confirmPassword, setConfirmPassword] = useState("");
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");
const navigate = useNavigate();
const [showModal, setShowModal] = useState(false);


useEffect(() => {
if (userRole !== "admin") {
    navigate("/unauthorized");
}
}, [userRole, navigate]);

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

const handleDeleteAccount = async () => {
try {
    const token = localStorage.getItem("userToken");
    await axios.delete("http://localhost:5000/api/user/profile", {
    headers: {
        Authorization: `Bearer ${token}`,
    },
    });

    // حذف توکن و ریدایرکت به صفحه اصلی
    localStorage.removeItem("userToken");
    alert("حساب شما با موفقیت حذف شد.");
    navigate("/");
} catch (err) {
    alert("خطا در حذف حساب.");
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
        <button
type="button"
onClick={() => setShowModal(true)}
className="w-full px-4 py-2 mt-4 text-white bg-red-500 rounded hover:bg-red-600"
>
حذف حساب
</button>

{/* مدال حذف حساب */}
<DeleteAccountModal
isOpen={showModal}
onClose={() => setShowModal(false)}
onConfirm={handleDeleteAccount}
/>

    </form>
    <HasPermission permission="delete_users">
                                                <button className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600">
                                                    حذف کاربران
                                                </button>
                                                </HasPermission>
    </div>
);
}