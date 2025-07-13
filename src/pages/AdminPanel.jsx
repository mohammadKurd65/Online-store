import { useNavigate, useEffect } from "react-router-dom";
import { decodeToken } from "../utils/jwtDecode";
export default function AdminPanel() {
const token = localStorage.getItem("userToken");
const decoded = decodeToken(token);
const userRole = decoded?.role;
const navigate = useNavigate();
useEffect(() => {
if (userRole !== "admin") {
    navigate("/unauthorized");
}
}, [userRole, navigate]);
return (
    <div className="container py-10 mx-auto">
    <h2 className="mb-4 text-2xl font-bold">پنل ادمین</h2>
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="p-4 border rounded shadow">
        <h3 className="mb-2 text-lg font-semibold">مدیریت محصولات</h3>
        <button className="px-4 py-2 text-white bg-green-500 rounded">افزودن محصول جدید</button>
        </div>
        <div className="p-4 border rounded shadow">
        <h3 className="mb-2 text-lg font-semibold">سفارشات</h3>
        <p>مشاهده و مدیریت سفارشات</p>
        </div>
    </div>
    </div>
);
}