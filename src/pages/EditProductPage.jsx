import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { decodeToken } from "../utils/jwtDecode"; 

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
    images: [],
});
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");
const [images, setImages] = useState([]);
const token = localStorage.getItem("userToken");
const decoded = decodeToken(token);
const userRole = decoded?.role;

useEffect(() => {
if (userRole !== "admin") {
    navigate("/unauthorized");
}
}, [userRole, navigate]);

useEffect(() => {
    const fetchProduct = async () => {
    try {
        const token = localStorage.getItem("adminToken");
        const res = await axios.get(`http://localhost:5000/api/products/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        });
        setFormData({
        ...res.data.data,
        image: res.data.data.image || "/images/placeholder.jpg",
        images: res.data.data.images || [],
        });
        setImages(
        res.data.data.images && res.data.data.images.length > 0
            ? res.data.data.images
            : [res.data.data.image || "/images/placeholder.jpg"]
        );
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

const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
    setFormData((prev) => ({ ...prev, imageFile: file }));
    }
};

  // افزودن تصویر جدید
const handleAddImage = (e) => {
    const newImage = e.target.value.trim();
    if (newImage && !images.includes(newImage)) {
    const updatedImages = [...images, newImage];
    setImages(updatedImages);
    setFormData((prev) => ({
        ...prev,
        images: updatedImages,
    }));
    }
    e.target.value = ""; // پاک کردن input بعد از افزودن
};

  // حذف تصویر
const handleRemoveImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    setFormData((prev) => ({
    ...prev,
    images: newImages,
    }));
};

const handleSubmit = async (e) => {
    e.preventDefault();
    try {
    const token = localStorage.getItem("adminToken");
    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("price", formData.price);
    formDataToSend.append("category", formData.category);
    formDataToSend.append("stock", formData.stock);
    formDataToSend.append("status", formData.status);

      // ارسال فایل تصویر اصلی (در صورت وجود)
    if (formData.imageFile) {
        formDataToSend.append("image", formData.imageFile);
    }

      // ارسال آرایه تصاویر (در صورت وجود)
    images.forEach((img) => {
        formDataToSend.append("images[]", img);
    });

    await axios.put(`http://localhost:5000/api/products/${id}`, formDataToSend, {
        headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
        },
    });

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

        {/* مدیریت تصاویر */}
        <div className="mb-4">
        <label className="block mb-2 text-gray-700">آپلود / مدیریت تصاویر</label>
          {/* نمایش تصاویر فعلی */}
        <div className="flex flex-wrap gap-4 mb-4">
            {images.map((img, index) => (
            <div key={index} className="relative">
                <img src={img} alt={`تصویر ${index + 1}`} className="object-cover w-24 h-24 rounded" />
                <button
                type="button"
                onClick={() => handleRemoveImage(index)}
                className="absolute top-0 right-0 flex items-center justify-center w-6 h-6 text-sm text-white bg-red-500 rounded-full hover:bg-red-600"
                >
                ×
                </button>
            </div>
            ))}
        </div>
          {/* افزودن تصویر جدید */}
        <input
            type="text"
            placeholder="URL تصویر جدید"
            className="w-full px-3 py-2 mb-2 border rounded"
            onBlur={handleAddImage}
        />
        <p className="mt-1 text-xs text-gray-500">برای آپلود، فقط URL رو وارد کن و از input خارج شو.</p>
        </div>

        {/* آپلود تصویر اصلی */}
        <div className="mb-4">
        <label className="block mb-2 text-gray-700">تصویر محصول</label>
        <input
            type="file"
            name="image"
            onChange={handleImageChange}
            accept="image/*"
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