import { Link } from "react-router-dom";

export default function Navbar() {
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
        <Link to="/login" className="text-blue-500 hover:underline">
        ورود
        </Link>
    </div>
    </nav>
);
}