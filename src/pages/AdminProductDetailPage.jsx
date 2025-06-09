import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { getStatusLabel, getStatusColor} from "../utils/statusManager"

export default function AdminProductDetailPage() {
const { id } = useParams();
const navigate = useNavigate();
const [product, setProduct] = useState(null);
const [loading, setLoading] = useState(true);

useEffect(() => {
    const fetchProduct = async () => {
    try {
        const token = localStorage.getItem("adminToken");
        const res = await axios.get(`http://localhost:5000/api/products/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        });
        setProduct(res.data.data);
    } catch (err) {
        console.error(err);
        alert("خطا در دریافت اطلاعات محصول.");
        navigate("/admin/products");
    } finally {
        setLoading(false);
    }
    };

    fetchProduct();
}, [id, navigate]);

if (loading) return <p>در حال بارگذاری...</p>;
if (!product) return <p>محصولی یافت نشد.</p>;

return (
    <div className="container py-10 mx-auto">
    <h2 className="mb-6 text-3xl font-bold">جزئیات محصول</h2>

      {/* تصویر محصول */}
    <div className="flex justify-center mb-6">
        <img
        src={product.image || "/images/placeholder.jpg"}
        alt={product.name}
        className="object-cover w-48 h-48 rounded shadow"
        />
    </div>

      {/* اطلاعات محصول */}
    <div className="p-6 mb-6 bg-white rounded shadow">
        <p><strong>نام:</strong> {product.name}</p>
        <p><strong>قیمت:</strong> {product.price.toLocaleString()} تومان</p>
        <p><strong>دسته‌بندی:</strong> {getStatusLabel(product.category, "productCategories")}</p>
        <p><strong>وضعیت:</strong> <span className={`inline-block px-3 py-1 rounded-full text-sm ${getStatusColor(product.status, "productStatuses")}`}>
        {getStatusLabel(product.status, "productStatuses")}
        </span></p>
        <p><strong>موجودی:</strong> {product.stock} عدد</p>
        <p><strong>توضیحات:</strong> {product.description || "بدون توضیح"}</p>
    </div>

      {/* دکمه‌ها */}
    <div className="flex space-x-4 space-x-reverse">
        <button
        onClick={() => navigate(`/admin/edit-product/${product._id}`)}
        className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
        >
        ویرایش
        </button>
        <button
        onClick={() => navigate(`/admin/delete-product/${product._id}`)}
        className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
        >
        حذف
        </button>
    </div>
    </div>
);
}

