import React from "react";
import Link from "react-router-dom";
import { getStatusLabel, getStatusColor} from "../utils/statusManager"

export default function ProductCard({ product }) {
return (
    <div className="overflow-hidden transition border rounded-lg shadow hover:shadow-lg">
      {/* تصویر محصول */}
    <img
src={product.image || "/images/placeholder.jpg"}
alt={product.name}
className="object-cover w-full h-48"
/>

      {/* اطلاعات محصول */}
    <div className="p-4">
        <h2 className="text-xl font-semibold">{product.name}</h2>
        <p className="mt-1 text-gray-600">قیمت: {product.price.toLocaleString()} تومان</p>

        {/* وضعیت با badge رنگی */}
        <span className={`inline-block px-2 py-1 text-xs rounded mt-2 ${getStatusColor(product.status, "productStatuses")}`}>
        {getStatusLabel(product.status, "productStatuses")}
        </span>

        {/* لینک مشاهده جزئیات */}
        <Link to={`/product/${product._id || product.id}`} className="block mt-4">
        <button className="w-full px-4 py-2 text-white transition bg-blue-500 rounded hover:bg-blue-600">
            مشاهده جزئیات
        </button>
        </Link>
    </div>
    </div>
);
}

// 👇 توابع getStatusLabel و getStatusColor (اگر قبلاً نساختی)

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