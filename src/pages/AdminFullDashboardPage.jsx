import React, { useEffect, useState } from "react";
import axios from "axios";
import {
ReusableFilterForm,
} from "../components";
import StatCard from "../utils/StatCard";
import UserRolePieChart from "../utils/UserRolePieChart";
import SalesTrendBarChart from "../utils/SalesTrendBarChart";
import OrderStatusDoughnutChart from "../utils/OrderStatusDoughnutChart";
import OrderTable from "../utils/OrderTable";
import ProductList from "../utils/ProductList";
import UserActivityChart from "../utils/UserActivityChart";
import { decodeToken } from "../utils/jwtDecode";
import { useNavigate } from "react-router-dom";

export default function AdminFullDashboardPage() {
const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalProducts: 0,
    paidOrders: 0,
    totalRevenue: 0,
});

const [users, setUsers] = useState([]);
const [orders, setOrders] = useState([]);
const [products, setProducts] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");

  // فیلترها
const [filters, setFilters] = useState({
    role: "",
    status: "",
    startDate: "",
    endDate: "",
    searchTerm: "",
});

const savedSettings = localStorage.getItem("dashboardSettings");
const initialSettings = savedSettings
    ? JSON.parse(savedSettings)
    : {
        showUserChart: true,
        showOrderChart: true,
        showProductChart: true,
        showSalesChart: true,
        theme: "light",
        itemsPerPage: 5,
        chartType: "bar",
    };

const [dashboardSettings, setDashboardSettings] = useState(initialSettings);

const navigate = useNavigate();
const token = localStorage.getItem("adminToken");
const decoded = decodeToken(token);
const userRole = decoded?.role;

useEffect(() => {
    if (userRole !== "admin") {
    navigate("/unauthorized");
    }
}, [userRole, navigate]);

useEffect(() => {
    const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
        const params = new URLSearchParams();

        if (filters.role) params.append("role", filters.role);
        if (filters.status) params.append("status", filters.status);
        if (filters.startDate) params.append("startDate", filters.startDate);
        if (filters.endDate) params.append("endDate", filters.endDate);
        if (filters.searchTerm) params.append("search", filters.searchTerm);

        // دریافت تمام داده‌ها با Promise.all
        const [
        userRes,
        orderRes,
        productRes,
        statsRes,
        ] = await Promise.all([
        axios.get(`http://localhost:5000/api/admin/users?${params}`, {
            headers: {
            Authorization: `Bearer ${token}`,
            },
        }),
        axios.get(`http://localhost:5000/api/orders/user/orders?${params}`, {
            headers: {
            Authorization: `Bearer ${token}`,
            },
        }),
        axios.get(`http://localhost:5000/api/products?${params}`, {
            headers: {
            Authorization: `Bearer ${token}`,
            },
        }),
        axios.get("http://localhost:5000/api/admin/dashboard/stats", {
            headers: {
            Authorization: `Bearer ${token}`,
            },
        }),
        ]);

        setUsers(userRes.data.data || []);
        setOrders(orderRes.data.data || []);
        setProducts(productRes.data.data || []);
        setStats(statsRes.data.data || stats);
    } catch (err) {
        setError("خطا در دریافت داده‌ها!");
        console.error(err);
    } finally {
        setLoading(false);
    }
    };

    fetchData();
}, [filters, dashboardSettings]);

return (
    <div className="container py-10 mx-auto">
    <h2 className="mb-6 text-3xl font-bold">داشبورد کامل ادمین</h2>

      {/* فیلترهای بالا */}
    <ReusableFilterForm
        filters={filters}
        onFilterChange={setFilters}
        showRole={true}
        showDateRange={true}
        showSearchTerm={true}
        showStatus={true}
        statusOptions={[
        { value: "", label: "همه" },
        { value: "active", label: "فعال" },
        { value: "inactive", label: "غیرفعال" },
        { value: "blocked", label: "مسدود" },
        ]}
        roleOptions={[
        { value: "", label: "همه نقش‌ها" },
        { value: "user", label: "کاربر عادی" },
        { value: "editor", label: "ویرایشگر" },
        { value: "admin", label: "ادمین" },
        ]}
    />

      {/* آمار عمومی */}
    <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-5">
        <StatCard title="کاربران" value={stats.totalUsers} color="bg-blue-500" />
        <StatCard title="فعال" value={stats.activeUsers} color="bg-green-500" />
        <StatCard title="سفارشات" value={stats.paidOrders} color="bg-purple-500" />
        <StatCard title="فروش کل" value={`${stats.totalRevenue.toLocaleString()} تومان`} color="bg-yellow-500" />
        <StatCard title="محصولات" value={stats.totalProducts} color="bg-indigo-500" />
    </div>

      {/* نمایش خطا */}
    {error && (
        <div className="mb-6 text-center text-red-600">
        {error}
        </div>
    )}

      {/* نمودارها فقط بر اساس تنظیمات داشبورد */}
    <div className="grid grid-cols-1 gap-8 mb-8 lg:grid-cols-2">
        {dashboardSettings.showUserChart && (
        <div className="p-6 bg-white rounded shadow">
            <h3 className="mb-4 text-xl font-semibold">روند ثبت‌نام کاربران</h3>
            <UserActivityChart users={users} />
        </div>
        )}

        {dashboardSettings.showProductChart && (
        <div className="p-6 bg-white rounded shadow">
            <h3 className="mb-4 text-xl font-semibold">توزیع نقش کاربران</h3>
            <UserRolePieChart users={users} />
        </div>
        )}

        {dashboardSettings.showSalesChart && (
        <div className="p-6 bg-white rounded shadow">
            <h3 className="mb-4 text-xl font-semibold">روند فروش ماهانه</h3>
            <SalesTrendBarChart orders={orders} />
        </div>
        )}

        {dashboardSettings.showOrderChart && (
        <div className="p-6 bg-white rounded shadow">
            <h3 className="mb-4 text-xl font-semibold">وضعیت سفارشات</h3>
            <OrderStatusDoughnutChart orders={orders} />
        </div>
        )}
    </div>

      {/* لیست آخرین سفارشات */}
    <div className="p-6 mb-8 bg-white rounded shadow">
        <h3 className="mb-4 text-xl font-semibold">آخرین سفارشات</h3>
        <OrderTable orders={orders.slice(0, 5)} />
    </div>

      {/* لیست محصولات */}
    <div className="p-6 mb-8 bg-white rounded shadow">
        <h3 className="mb-4 text-xl font-semibold">محصولات اخیر</h3>
        <ProductList products={products.slice(0, 5)} />
        </div>
        {/*تنظیمات داشبورد */}
        <div className="p-6 bg-white rounded shadow">
            
        </div>
        </div>
);
}