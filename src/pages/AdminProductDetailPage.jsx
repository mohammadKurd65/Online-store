import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { getStatusLabel, getStatusColor} from "../utils/statusManager";
import DeleteProductModal from "../components/DeleteProductModal";

export default function AdminProductDetailPage() {
const { id } = useParams();
const navigate = useNavigate();
const [product, setProduct] = useState(null);
const [showModal, setShowModal] = useState(false);
const [loading, setLoading] = useState(false);

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

const handleDelete = async () => {
try {
    const token = localStorage.getItem("adminToken");
    await axios.delete(`http://localhost:5000/api/products/${product._id}`, {
    headers: {
        Authorization: `Bearer ${token}`,
    },
    });

    alert("محصول با موفقیت حذف شد.");
    navigate("/admin/products");
} catch (err) {
    alert("خطا در حذف محصول.");
    console.error(err);
}
};

if (loading) return <p>در حال بارگذاری...</p>;
if (!product) return <p>محصولی یافت نشد.</p>;

return (
    <div className="container py-10 mx-auto">
    <h2 className="mb-6 text-3xl font-bold">جزئیات محصول</h2>

    {/* نمایش چند تصویر */}
<div className="grid grid-cols-2 gap-4 mb-6 md:grid-cols-3">
{product.images?.map((img, index) => (
    <img
    key={index}
    src={img}
    alt={`${product.name} - ${index + 1}`}
    className="object-cover w-full h-48 rounded shadow"
    />
))}
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

        <button
onClick={() => setShowModal(true)}
className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
>
حذف
</button>
        
        {/* مدال حذف */}
<DeleteProductModal
isOpen={showModal}
onClose={() => setShowModal(false)}
onConfirm={handleDelete}
itemName={`"${product.name}"`}
/>
    </div>
    </div>
);
}

