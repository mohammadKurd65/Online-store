import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { decodeToken } from "../utils/jwtDecode";

export default function Navbar() {
const { currentUser } = useAuth();
const token = localStorage.getItem("userToken");
const decoded = decodeToken(token);
const userRole = decoded?.role;

// if (userRole !== "admin") {
//   return null; // یا یک پیام دسترسی غیرمجاز
// }
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
<Link to="/admin/orders" className="text-blue-500 hover:underline">
پنل ادمین
</Link>
<Link to="/admin/login" className="text-blue-500 hover:underline">
ورود ادمین
</Link>
<Link to="/admin/users" className="text-blue-500 hover:underline">
ادمین‌ها
</Link>
<Link to="/admin/add-admin" className="text-blue-500 hover:underline">
افزودن ادمین
</Link>
<Link to="/admin" className="text-blue-500 hover:underline">
داشبورد
</Link>
<Link to="/user/login" className="text-blue-500 hover:underline">
ورود کاربر
</Link>
<Link to="/user/register" className="text-blue-500 hover:underline">
ثبت‌نام کاربر
</Link>
{localStorage.getItem("userToken") && (
<>
    <Link to="/user/profile" className="text-blue-500 hover:underline">
    پروفایل
    </Link>
    <Link to="/cart" className="text-blue-500 hover:underline">
    سبد خرید
    </Link>
</>
)}
<Link to="/user/edit-profile" className="text-blue-500 hover:underline">
ویرایش پروفایل
</Link>
<Link to="/user/dashboard" className="text-blue-500 hover:underline">
داشبورد
</Link>
<Link to="/admin/add-product" className="text-blue-500 hover:underline">
افزودن محصول
</Link>
<Link to="/admin/products" className="text-blue-500 hover:underline">
محصولات
</Link>
<Link to="/admin/products" className="text-blue-500 hover:underline">
محصولات
</Link>
<Link to="/admin/users" className="text-blue-500 hover:underline">
کاربران
</Link>
<Link to="/admin/add-user" className="text-blue-500 hover:underline">
افزودن کاربر
</Link>
<Link to="/admin/dashboard" className="text-blue-500 hover:underline">
داشبورد کامل
</Link>

<Link to="/admin/dashboard/settings" className="text-blue-500 hover:underline">
تنظیمات داشبورد
</Link>

<Link to="/admin/permissions" className="text-blue-500 hover:underline">
مدیریت دسترسی‌ها
</Link>

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
</div>
)}
        </>
        )}
    </div>
    </nav>
);
}