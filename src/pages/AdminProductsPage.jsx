import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getStatusLabel, getStatusColor} from "../utils/statusManager";
import Pagination from "../components/Pagination";


export default function AdminProductsPage() {
const [products, setProducts] = useState([]);
const navigate = useNavigate();
const [filters, setFilters] = useState({
category: "",
status: "",
minPrice: "",
maxPrice: "",
inStock: false,
});
const [page, setPage] = useState(1);
const [totalPages, setTotalPages] = useState(1);

useEffect(() => {
const fetchProducts = async () => {
    try {
    const token = localStorage.getItem("adminToken");
    const params = new URLSearchParams();

    if (filters.category) params.append("category", filters.category);
    if (filters.status) params.append("status", filters.status);
    if (filters.minPrice) params.append("minPrice", filters.minPrice);
    if (filters.maxPrice) params.append("maxPrice", filters.maxPrice);
    if (filters.inStock) params.append("inStock", true);
    params.append("page", page);

    const res = await axios.get(`http://localhost:5000/api/products?${params}`, {
        headers: {
        Authorization: `Bearer ${token}`,
        },
    });

    setProducts(res.data.data || []);
    setTotalPages(res.data.pagination.totalPages || 1);
    } catch (err) {
    console.error(err);
    }
};

fetchProducts();
}, [filters, page]);

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
    {products.map((product) => (
        <tr key={product._id} className="hover:bg-gray-50">
        <td className="px-4 py-2 border-b">{product.name}</td>
        <td className="px-4 py-2 border-b">{product.price.toLocaleString()} تومان</td>
        <td className="px-4 py-2 capitalize border-b">{product.category}</td>
        <td className="px-4 py-2 border-b">
            <span className={`inline-block px-3 py-1 rounded-full text-sm ${getStatusColor(product.status, "productStatuses")}`}>
            {getStatusLabel(product.status, "productStatuses")}
            </span>
        </td>
        <td className="px-4 py-2 border-b">
            {product.stock} عدد
        </td>
        <td className="flex px-4 py-2 space-x-2 space-x-reverse border-b">
            <button
            onClick={() => navigate(`/admin/edit-product/${product._id}`)}
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
    ))}
    </tbody>
        </table>
    </div>

    {/* صفحه‌بندی */}
<Pagination
currentPage={page}
totalPages={totalPages}
onPageChange={(newPage) => setPage(newPage)}
/>

    {/* فرم فیلتر */}
<div className="p-4 mb-6 bg-white rounded shadow">
<h3 className="mb-4 text-lg font-semibold">فیلتر محصولات</h3>
<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
    
    {/* دسته‌بندی */}
    <div>
    <label className="block mb-2 text-sm text-gray-700">دسته‌بندی</label>
    <select
        value={filters.category}
        onChange={(e) =>
        setFilters((prev) => ({ ...prev, category: e.target.value }))
        }
        className="w-full px-3 py-2 border rounded"
    >
        <option value="">همه</option>
        <option value="electronics">الکترونیک</option>
        <option value="clothing">پوشاک</option>
        <option value="books">کتاب</option>
        <option value="home">خانه و آشپزخانه</option>
        <option value="others">سایر</option>
    </select>
    </div>

    {/* وضعیت */}
    <div>
    <label className="block mb-2 text-sm text-gray-700">وضعیت</label>
    <select
        value={filters.status}
        onChange={(e) =>
        setFilters((prev) => ({ ...prev, status: e.target.value }))
        }
        className="w-full px-3 py-2 border rounded"
    >
        <option value="">همه</option>
        <option value="new">جدید</option>
        <option value="on-sale">در حال فروش</option>
        <option value="out-of-stock">تمام شده</option>
    </select>
    </div>

    {/* قیمت */}
    <div>
    <label className="block mb-2 text-sm text-gray-700">قیمت (تومان)</label>
    <div className="flex space-x-2 space-x-reverse">
        <input
        type="number"
        placeholder="حداقل"
        value={filters.minPrice}
        onChange={(e) =>
            setFilters((prev) => ({ ...prev, minPrice: e.target.value }))
        }
        className="w-1/2 px-3 py-2 border rounded"
        />
        <input
        type="number"
        placeholder="حداکثر"
        value={filters.maxPrice}
        onChange={(e) =>
            setFilters((prev) => ({ ...prev, maxPrice: e.target.value }))
        }
        className="w-1/2 px-3 py-2 border rounded"
        />
    </div>
    </div>

    {/* فقط موجودی */}
    <div className="flex items-center">
    <input
        type="checkbox"
        id="inStock"
        checked={filters.inStock}
        onChange={() =>
        setFilters((prev) => ({ ...prev, inStock: !filters.inStock }))
        }
        className="mr-2"
    />
    <label htmlFor="inStock" className="text-sm text-gray-700">
        فقط محصولات موجود
    </label>
    </div>
</div>
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