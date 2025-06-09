import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AddProductPage() {
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

const [error, setError] = useState("");

const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
};

const handleSubmit = async (e) => {
    e.preventDefault();
    try {
    const token = localStorage.getItem("adminToken");
    const res = await axios.post("http://localhost:5000/api/products", formData, {
        headers: {
            "Content-Type": "appLication/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
            "Access-Control-Allow-Credentials": "true",
            "Access-Control-Max-Age": "86400",
            "Access-Control-Expose-Headers": "Content-Length, X-Kuma-Revision",
        Authorization: `Bearer ${token}`,
        "X-requested-with": "XMLHTTPREQUEST"
        },
    });
    if(res.status !== 201) {
        throw new Error("خطا در افزودن محصول");
    }
    alert("محصول با موفقیت اضافه شد.");
      navigate("/admin/products"); // بعداً این صفحه رو هم بساز
    } catch (err) {
    setError("خطا در افزودن محصول.");
    console.error(err);
    }
};

return (
    <div className="container py-10 mx-auto">
    <h2 className="mb-6 text-2xl font-bold">افزودن محصول جدید</h2>
    {error && <p className="mb-4 text-red-500">{error}</p>}

    <form onSubmit={handleSubmit} className="max-w-lg p-6 mx-auto bg-white rounded shadow">
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

        <div className="mb-4">
        <label className="block mb-2 text-gray-700">توضیحات</label>
        <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            rows="4"
        ></textarea>
        </div>

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

        <button
        onClick={handleSubmit}
        type="submit"
        disabled={!formData.name || !formData.price || !formData.stock}
        className="w-full px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600"
        >
        ذخیره محصول
        </button>
    </form>
    </div>
);
}