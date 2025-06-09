import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getStatusLabel, getStatusColor} from "../utils/statusManager";


export default function AdminProductsPage() {
const [products, setProducts] = useState([]);
const navigate = useNavigate();

useEffect(() => {
    const fetchProducts = async () => {
    try {
        const token = localStorage.getItem("adminToken");
        const res = await axios.get("http://localhost:5000/api/products", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        });
        setProducts(res.data.data);
    } catch (err) {
        console.error(err);
    
    }
    };

    fetchProducts();
}, []);

return (
    <div className="container py-10 mx-auto">
    <h2 className="mb-6 text-3xl font-bold">لیست محصولات</h2>

      {/* لیست محصولات */}
    <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded shadow">
        <thead className="bg-gray-100">
            <tr>
            <th className="px-4 py-2 text-left border-b">نام</th>
            <th className="px-4 py-2 text-left border-b">قیمت</th>
            <th className="px-4 py-2 text-left border-b">دسته‌بندی</th>
            <th className="px-4 py-2 text-left border-b">وضعیت</th>
            <th className="px-4 py-2 text-left border-b">عملیات</th>
            </tr>
        </thead>
        <tbody>
            {products.length === 0 ? (
            <tr>
                <td colSpan="5" className="py-4 text-center">
                محصولی یافت نشد.
                </td>
            </tr>
            ) : (
            products.map((product) => (
                <tr key={product._id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border-b">{product.name}</td>
                <td className="px-4 py-2 border-b">{product.price.toLocaleString()} تومان</td>
                <td className="px-4 py-2 capitalize border-b">{product.category}</td>
                <td className="px-4 py-2 border-b">
                    <span className={`inline-block px-3 py-1 rounded-full text-sm ${getStatusColor(product.status, "productStatuses")}`}>
                    {getStatusLabel(product.status, "productStatuses")}
                    </span>
                </td>
                <td className="flex px-4 py-2 space-x-2 space-x-reverse border-b">
                    <button
                    onClick={() => navigate(`/admin/product/${product._id}`)}
                    className="text-blue-500 hover:underline"
                    >
                    ویرایش
                    </button>
                    <button
                    onClick={() => navigate(`/admin/delete-product/${product._id}`)}
                    className="text-red-500 hover:underline"
                    >
                    حذف
                    </button>
                </td>
                </tr>
            ))
            )}
        </tbody>
        </table>
    </div>
    </div>
);
}

// 👇 این دو تابع رو قبلاً ساختی – فقط اگر توی این صفحه نداری، اینجا بنویس:

// function getStatusLabel(status, type = "orderStatuses") {
//   const statusConfig = {
//     orderStatuses: [
//       { value: "pending", label: "در انتظار", color: "bg-yellow-100 text-yellow-800" },
//       { value: "paid", label: "پرداخت شده", color: "bg-green-100 text-green-800" },
//       { value: "failed", label: "ناموفق", color: "bg-red-100 text-red-800" },
//       { value: "canceled", label: "لغو شده", color: "bg-gray-100 text-gray-800" },
//     ],
//     productStatuses: [
//       { value: "new", label: "جدید", color: "bg-green-100 text-green-800" },
//       { value: "on-sale", label: "در حال فروش", color: "bg-blue-100 text-blue-800" },
//       { value: "out-of-stock", label: "تمام شده", color: "bg-red-100 text-red-800" },
//     ],
//   };

//   const item = statusConfig[type].find((s) => s.value === status);
//   return item ? item.label : "ناشناخته";
// }

// function getStatusColor(status, type = "orderStatuses") {
//   const statusConfig = {
//     orderStatuses: [
//       { value: "pending", label: "در انتظار", color: "bg-yellow-100 text-yellow-800" },
//       { value: "paid", label: "پرداخت شده", color: "bg-green-100 text-green-800" },
//       { value: "failed", label: "ناموفق", color: "bg-red-100 text-red-800" },
//       { value: "canceled", label: "لغو شده", color: "bg-gray-100 text-gray-800" },
//     ],
//     productStatuses: [
//       { value: "new", label: "جدید", color: "bg-green-100 text-green-800" },
//       { value: "on-sale", label: "در حال فروش", color: "bg-blue-100 text-blue-800" },
//       { value: "out-of-stock", label: "تمام شده", color: "bg-red-100 text-red-800" },
//     ],
//   };

//   const item = statusConfig[type].find((s) => s.value === status);
//   return item ? item.color : "bg-gray-100 text-gray-800";
// }