import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
const { currentUser } = useAuth();

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
        </>
        )}
    </div>
    </nav>
);
}