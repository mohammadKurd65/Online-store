import React, { useState, useEffect } from "react";
import axios from "axios";
import ProductCard from "../components/ProductCard";
import ProductFilterForm from "../components/ProductFilterForm";
import { decodeToken } from "../utils/jwtDecode";
import { useNavigate } from "react-router-dom";

export default function Home() {
const [filters, setFilters] = useState({
    category: "",
    priceRange: "",
    inStock: false,
    status: "",
});
const [products, setProducts] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");
const token = localStorage.getItem("userToken");
const decoded = decodeToken(token);
const userRole = decoded?.role;

const navigate = useNavigate();
useEffect(() => {
if (userRole !== "admin") {
    navigate("/unauthorized");
}
}, [userRole, navigate]);

useEffect(() => {
    const fetchProducts = async () => {
    try {
        const params = new URLSearchParams();
        if (filters.category) params.append("category", filters.category);
        if (filters.priceRange) params.append("price", filters.priceRange);
        if (filters.inStock) params.append("inStock", "true"); // مقدار رشته‌ای
        if (filters.status) params.append("status", filters.status);

        const res = await axios.get(`http://localhost:5000/api/products?${params}`);
        setProducts(res.data.data);
    } catch (err) {
        console.error(err);
        setError("خطا در دریافت اطلاعات محصولات.");
    } finally {
        setLoading(false);
    }
    };

    fetchProducts();
}, [filters]);

if (loading) return <p>در حال بارگذاری...</p>;
if (error) return <p className="text-red-500">{error}</p>;

return (
    <div className="container py-10 mx-auto">
    <h1 className="mb-6 text-3xl font-bold">محصولات</h1>
    <ProductFilterForm filters={filters} onFilterChange={setFilters} />
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
        {products.map((product) => (
        <ProductCard key={product._id} product={product} />
        ))}
    </div>
    </div>
);
}