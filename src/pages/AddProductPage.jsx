import React, { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { decodeToken } from "../utils/jwtDecode";
import { usePermission } from "../hooks/usePermission";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";


export default function AddProductPage() {
const navigate = useNavigate();
const validationSchema = yup.object().shape({
name: yup
    .string()
    .required("نام محصول الزامی است")
    .min(3, "نام محصول باید حداقل 3 کاراکتر باشد")
    .max(100, "نام محصول نباید بیشتر از 100 کاراکتر باشد"),
description: yup
    .string()
    .required("توضیحات محصول الزامی است")
    .min(10, "توضیحات محصول باید حداقل 10 کاراکتر باشد")
    .max(1000, "توضیحات محصول نباید بیشتر از 1000 کاراکتر باشد"),
price: yup
    .number()
    .typeError("قیمت باید عدد باشد")
    .required("قیمت محصول الزامی است")
    .min(1000, "قیمت محصول باید حداقل 1000 تومان باشد"),
category: yup
    .string()
    .required("دسته‌بندی محصول الزامی است")
    .oneOf(["electronics", "clothing", "books", "home", "others"], "دسته‌بندی نامعتبر است"),
stock: yup
    .number()
    .typeError("موجودی باید عدد باشد")
    .required("موجودی محصول الزامی است")
    .min(0, "موجودی نمی‌تواند منفی باشد")
    .integer("موجودی باید عدد صحیح باشد"),
status: yup
    .string()
    .required("وضعیت محصول الزامی است")
    .oneOf(["new", "on-sale", "out-of-stock"], "وضعیت نامعتبر است"),
image: yup
    .string()
    .required("آدرس تصویر الزامی است")
    .url("آدرس تصویر نامعتبر است")
});

const {
register,
handleSubmit,
formState: { errors },
setError: setFormError,
} = useForm({
resolver: yupResolver(validationSchema),
defaultValues: {
    name: "",
    description: "",
    price: "",
    category: "electronics",
    stock: "",
    status: "new",
    image: "/images/placeholder.jpg",
}
});

const token = localStorage.getItem("userToken");
const decoded = decodeToken(token);
const userRole = decoded?.role;
const { canDeleteUsers } = usePermission();

if (canDeleteUsers) {
  // نمایش دکمه حذف
}

useEffect(() => {
if (userRole !== "admin") {
    navigate("/unauthorized");
}
}, [userRole, navigate]);



const onSubmit = async (data) => {
    try {
    const token = localStorage.getItem("adminToken");
    const res = await axios.post("http://localhost:5000/api/products", data, {
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
    setFormError("root", { message: "خطا در افزودن محصول." });
    console.error(err);
    }
};

return (
    <div className="container py-10 mx-auto">
    <h2 className="mb-6 text-2xl font-bold">افزودن محصول جدید</h2>
    {errors.root?.message && <p className="mb-4 text-red-500">{errors.root.message}</p>}

    <form onSubmit={handleSubmit(onSubmit)} className="p-6 mx-auto max-w-lg bg-white rounded shadow">
        <div className="mb-4">
        <label className="block mb-2 text-gray-700">نام محصول</label>
        <input
            type="text"
            name="name"
            {...register("name")}
            className={`w-full px-3 py-2 border rounded ${errors.name ? 'border-red-500' : ''}`}
        />
        </div>
        {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}

        <div className="mb-4">
        <label className="block mb-2 text-gray-700">توضیحات</label>
        <textarea
            name="description"
            {...register("description")}
            className={`w-full px-3 py-2 border rounded ${errors.description ? 'border-red-500' : ''}`}
            rows="4"
        ></textarea>
        </div>
        {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description.message}</p>}

        <div className="mb-4">
        <label className="block mb-2 text-gray-700">قیمت (تومان)</label>
        <input
            type="number"
            name="price"
            {...register("price")}
            className={`w-full px-3 py-2 border rounded ${errors.price ? 'border-red-500' : ''}`}
        />
        </div>
        {errors.price && <p className="mt-1 text-sm text-red-500">{errors.price.message}</p>}

        <div className="mb-4">
        <label className="block mb-2 text-gray-700">دسته‌بندی</label>
        <select
            name="category"
            {...register("category")}
            className={`w-full px-3 py-2 border rounded ${errors.category ? 'border-red-500' : ''}`}
        >
            <option value="electronics">الکترونیک</option>
            <option value="clothing">پوشاک</option>
            <option value="books">کتاب</option>
            <option value="home">خانه و آشپزخانه</option>
            <option value="others">سایر</option>
        </select>
        </div>
        {errors.category && <p className="mt-1 text-sm text-red-500">{errors.category.message}</p>}

        <div className="mb-4">
        <label className="block mb-2 text-gray-700">موجودی</label>
        <input
            type="number"
            name="stock"
            {...register("stock")}
            className={`w-full px-3 py-2 border rounded ${errors.stock ? 'border-red-500' : ''}`}
        />
        </div>
        {errors.stock && <p className="mt-1 text-sm text-red-500">{errors.stock.message}</p>}

        <div className="mb-4">
        <label className="block mb-2 text-gray-700">وضعیت</label>
        <select
            name="status"
            {...register("status")}
            className={`w-full px-3 py-2 border rounded ${errors.status ? 'border-red-500' : ''}`}
        >
            <option value="new">جدید</option>
            <option value="on-sale">در حال فروش</option>
            <option value="out-of-stock">تمام شده</option>
        </select>
        </div>
        {errors.status && <p className="mt-1 text-sm text-red-500">{errors.status.message}</p>}

        <div className="mb-4">
        <label className="block mb-2 text-gray-700">تصویر (URL)</label>
        <input
            type="text"
            name="image"
            {...register("image")}
            className={`w-full px-3 py-2 border rounded ${errors.image ? 'border-red-500' : ''}`}
        />
        </div>

        <button
        type="submit"
        disabled={!!(errors.name || errors.price || errors.stock)}
        className="px-4 py-2 w-full text-white bg-green-500 rounded hover:bg-green-600"
        >
        ذخیره محصول
        </button>
    </form>
    </div>
);
}