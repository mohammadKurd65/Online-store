import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

export default function EditProductPage() {
const { id } = useParams();
const navigate = useNavigate();
const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "electronics",
    stock: "",
    status: "new",
    image: "/images/placeholder.jpg",
});
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");

useEffect(() => {
    const fetchProduct = async () => {
    try {
        const token = localStorage.getItem("adminToken");
        const res = await axios.get(`http://localhost:5000/api/products/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        });
        setFormData(res.data.data);
    } catch (err) {
        alert("خطا در دریافت اطلاعات محصول.");
        navigate("/admin/products");
    } finally {
        setLoading(false);
    }
    };

    fetchProduct();
}, [id, navigate]);

const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
};

const handleSubmit = async (e) => {
    e.preventDefault();
    try {
    const token = localStorage.getItem("adminToken");
    const res = await axios.put(`http://localhost:5000/api/products/${id}`, formData, {
        headers: {
        Authorization: `Bearer ${token}`,
        },
    });
    setFormData(res.data.data);
    alert("محصول با موفقیت آپدیت شد.");
    navigate(`/admin/product/${id}`);
    } catch (err) {
    setError("خطا در ذخیره تغییرات.");
    console.error(err);
    }
};

if (loading) return <p>در حال بارگذاری...</p>;

return (
    <div className="container py-10 mx-auto">
    <h2 className="mb-6 text-3xl font-bold">ویرایش محصول</h2>
    {error && <p className="mb-4 text-red-500">{error}</p>}

    <form onSubmit={handleSubmit} className="max-w-lg p-6 mx-auto bg-white rounded shadow">
        {/* نام محصول */}
        <div className="mb-4">
        <label className="block mb-2 text-gray-700">نام محصول</label>
        <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
        />
        </div>

        {/* توضیحات */}
        <div className="mb-4">
        <label className="block mb-2 text-gray-700">توضیحات</label>
        <textarea
            name="description"
            value={formData.description || ""}
            onChange={handleChange}
            rows="4"
            className="w-full px-3 py-2 border rounded"
        ></textarea>
        </div>

        {/* قیمت */}
        <div className="mb-4">
        <label className="block mb-2 text-gray-700">قیمت (تومان)</label>
        <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
        />
        </div>

        {/* دسته‌بندی */}
        <div className="mb-4">
        <label className="block mb-2 text-gray-700">دسته‌بندی</label>
        <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
        >
            <option value="electronics">الکترونیک</option>
            <option value="clothing">پوشاک</option>
            <option value="books">کتاب</option>
            <option value="home">خانه و آشپزخانه</option>
            <option value="others">سایر</option>
        </select>
        </div>

        {/* موجودی */}
        <div className="mb-4">
        <label className="block mb-2 text-gray-700">موجودی</label>
        <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
        />
        </div>

        {/* وضعیت */}
        <div className="mb-4">
        <label className="block mb-2 text-gray-700">وضعیت</label>
        <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
        >
            <option value="new">جدید</option>
            <option value="on-sale">در حال فروش</option>
            <option value="out-of-stock">تمام شده</option>
        </select>
        </div>

        {/* تصویر */}
        <div className="mb-4">
        <label className="block mb-2 text-gray-700">تصویر (URL)</label>
        <input
            type="text"
            name="image"
            value={formData.image}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
        />
        </div>

        {/* دکمه‌ها */}
        <div className="flex space-x-4 space-x-reverse">
        <button
            type="submit"
            className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
        >
            ذخیره تغییرات
        </button>
        <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 text-white bg-gray-500 rounded hover:bg-gray-600"
        >
            لغو
        </button>
        </div>
    </form>
    </div>
);
}