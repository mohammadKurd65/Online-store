import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { decodeToken } from "../utils/jwtDecode";
// import NotificationBell from "./NotificationBell";

console.log("Auth Context:", { useAuth }); // برای دیباگ

export default function Navbar() {
const { currentUser } = useAuth();
const token = localStorage.getItem("userToken");
const decoded = decodeToken(token);
const userRole = decoded?.role;
const [showBroadcastModal, setShowBroadcastModal] = useState(false);

return (
    <nav className="flex items-center justify-between p-4 bg-white shadow">
    <h1 className="text-xl font-bold">علی‌بابا کلون</h1>
    <div className="space-x-4 space-x-reverse">
        <Link to="/cart" className="text-blue-500 hover:underline">
        سبد خرید
        </Link>
        <Link to="/wishlist" className="text-blue-500 hover:underline">
        علاقه‌مندی‌ها
        </Link>
        {currentUser ? (
        <span className="text-green-600">سلام، {currentUser.email}</span>
        ) : (
        <>
            <Link to="/login" className="text-blue-500 hover:underline">
            ورود
            </Link>
            <Link to="/register" className="text-blue-500 hover:underline">
            ثبت‌نام
            </Link>
            <Link to="/orders" className="text-blue-500 hover:underline">
            سفارشات
            </Link>
            <Link to="/admin/login" className="text-blue-500 hover:underline">
            ورود ادمین
            </Link>
            <Link to="/user/login" className="text-blue-500 hover:underline">
            ورود کاربر
            </Link>
            <Link to="/user/register" className="text-blue-500 hover:underline">
            ثبت‌نام کاربر
            </Link>
        </>
        )}
        
        {token && (
        <div className="flex items-center ml-4 space-x-6 space-x-reverse">
            {userRole === "admin" && (
            <Link to="/admin/dashboard" className="text-blue-500 hover:underline">
                داشبورد ادمین
            </Link>
            )}

            {userRole === "editor" && (
            <Link to="/editor/dashboard" className="text-blue-500 hover:underline">
                داشبورد ویرایشگر
            </Link>
            )}

            {userRole === "user" && (
            <Link to="/user/dashboard" className="text-blue-500 hover:underline">
                داشبورد من
            </Link>
            )}
            
            {userRole === "admin" && (
            <button
                onClick={() => setShowBroadcastModal(true)}
                className="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600"
            >
                ارسال اعلان دستی
            </button>
            )}
        </div>
        )}
    </div>
    </nav>
);
}