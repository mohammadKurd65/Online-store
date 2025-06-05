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
        </>
        )}
    </div>
    </nav>
);
}