import React, { useEffect, useState } from "react";
import { decodeToken } from "../utils/jwtDecode";
import axios from "axios";
import {
ReusableFilterForm,
ProductCard,
getStatusColor,
getStatusLabel,
} from "../components";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { useNavigate } from "react-router-dom";
import HasPermission from "../components/HasPermission";
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
import { usePermission} from "../hooks/usePermission";

function SalesBarChart({ orders }) {
const navigate = useNavigate();
const labels = ["فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد"];
const data = {
    labels,
    datasets: [
    {
        label: "فروش (تومان)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
        borderColor: "rgba(53, 162, 235, 1)",
        borderWidth: 1,
        data: [1000000, 2000000, 1500000, 3000000, 2500000],
    },
    ],
};
const { canDeleteUsers } = usePermission();

if (canDeleteUsers) {
  // نمایش دکمه حذف
}
const options = {
    responsive: true,
    plugins: {
    legend: { display: false },
    tooltip: {
        callbacks: {
        label: (context) => `${context.raw.toLocaleString()} تومان`,
        },
    },
    title: {
        display: true,
        text: "آمار فروش ماهانه",
    },
    },
};

const token = localStorage.getItem("userToken");
const decoded = decodeToken(token);
const userRole = decoded?.role;

useEffect(() => {
if (userRole !== "admin") {
    navigate("/unauthorized");
}
}, [userRole, navigate]);

return <Bar data={data} options={options} />;
}

export default function AdminDashboardPage() {
    const { canDeleteUsers } = usePermission();

if (canDeleteUsers) {
  // نمایش دکمه حذف
}
const navigate = useNavigate();
const [stats, setStats] = useState({
    totalOrders: 0,
    paidOrders: 0,
    totalRevenue: 0,
    totalAdmins: 0,
    totalProducts: 0,
});
const [recentOrders, setRecentOrders] = useState([]);
const [products, setProducts] = useState([]);
const token = localStorage.getItem("userToken");
const decoded = decodeToken(token);
const userRole = decoded?.role;

useEffect(() => {
if (userRole !== "admin") {
    navigate("/unauthorized");
}
}, [userRole, navigate]);

useEffect(() => {
    const fetchData = async () => {
    try {
        const token = localStorage.getItem("adminToken");

        // دریافت آمار
        const statsRes = await axios.get("http://localhost:5000/api/admin/dashboard", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        });

        // دریافت سفارشات اخیر
        const ordersRes = await axios.get("http://localhost:5000/api/orders/orders?limit=5", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        });

        // دریافت لیست محصولات
        const productsRes = await axios.get("http://localhost:5000/api/products?limit=5", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        });

        setStats(statsRes.data.data);
        setRecentOrders(ordersRes.data.data);
        setProducts(productsRes.data.data);
    } catch (err) {
        console.error(err);
    }
    };

    fetchData();
}, []);

return (
    <div className="container py-10 mx-auto">
    <h2 className="mb-6 text-3xl font-bold">داشبورد ادمین</h2>

      {/* آمار */}
    <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-5">
        <StatCard title="سفارشات کل" value={stats.totalOrders} color="bg-blue-500" />
        <StatCard title="پرداخت شده" value={stats.paidOrders} color="bg-green-500" />
        <StatCard title="مجموع فروش" value={`${stats.totalRevenue.toLocaleString()} تومان`} color="bg-purple-500" />
        <StatCard title="محصولات" value={stats.totalProducts} color="bg-yellow-500" />
        <StatCard title="ادمین‌ها" value={stats.totalAdmins} color="bg-indigo-500" />
    </div>

      {/* لیست آخرین سفارشات */}
    <div className="p-6 mb-8 bg-white rounded shadow">
        <h3 className="mb-4 text-xl font-semibold">آخرین سفارشات</h3>
        <OrderTable orders={recentOrders} />
    </div>

      {/* لیست محصولات */}
    <div className="p-6 mb-8 bg-white rounded shadow">
        <h3 className="mb-4 text-xl font-semibold">محصولات اخیر</h3>
        <ProductList products={products} />
    </div>

      {/* فیلتر پیشرفته */}
    <div className="mb-8">
        <h3 className="mb-4 text-xl font-semibold">جستجو و فیلتر</h3>
        <ReusableFilterForm
        filters={{
            category: "",
            status: "",
            startDate: "",
            endDate: "",
            searchTerm: "",
        }}
        onFilterChange={(newFilters) => {
            console.log("فیلتر عوض شد:", newFilters);
        }}
        showRole={false}
        showDateRange={true}
        showSearchTerm={true}
        showStatus={true}
        />
    </div>
    </div>
);
}

// کامپوننت کوچک برای هر استات
function StatCard({ title, value, color }) {
    const { canDeleteUsers } = usePermission();

if (canDeleteUsers) {
  // نمایش دکمه حذف
}
    const navigate = useNavigate();
const token = localStorage.getItem("userToken");
const decoded = decodeToken(token);
const userRole = decoded?.role;

useEffect(() => {
if (userRole !== "admin") {
    navigate("/unauthorized");
}
}, [userRole, navigate]);
return (
    <div className={`p-6 rounded shadow text-white ${color}`}>
    <h3 className="text-lg">{title}</h3>
    <p className="mt-2 text-xl font-bold">{value}</p>
    </div>
);
}

// جدول آخرین سفارشات
function OrderTable({ orders }) {
    const { canDeleteUsers } = usePermission();

if (canDeleteUsers) {
  // نمایش دکمه حذف
}
    const navigate = useNavigate();
const token = localStorage.getItem("userToken");
const decoded = decodeToken(token);
const userRole = decoded?.role;

useEffect(() => {
if (userRole !== "admin") {
    navigate("/unauthorized");
}
}, [userRole, navigate]);
return (
    <div className="overflow-x-auto">
    <table className="min-w-full bg-white border rounded shadow">
        <thead className="bg-gray-100">
        <tr>
            <th className="px-4 py-2 text-left border-b">شناسه</th>
            <th className="px-4 py-2 text-left border-b">مبلغ</th>
            <th className="px-4 py-2 text-left border-b">وضعیت</th>
            <th className="px-4 py-2 text-left border-b">مشاهده</th>
        </tr>
        </thead>
        <tbody>
        {orders.length === 0 ? (
            <tr>
            <td colSpan="4" className="py-4 text-center">
                سفارشی یافت نشد.
            </td>
            </tr>
        ) : (
            orders.map((order) => (
            <tr key={order._id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border-b">{order._id}</td>
                <td className="px-4 py-2 border-b">{order.amount.toLocaleString()} تومان</td>
                <td className="px-4 py-2 border-b">
                <span
                    className={`inline-block px-3 py-1 rounded-full text-sm ${getStatusColor(order.paymentStatus, "orderStatuses")}`}
                >
                    {getStatusLabel(order.paymentStatus, "orderStatuses")}
                </span>
                </td>
                <td className="px-4 py-2 border-b">
                <a href={`/admin/order/${order._id}`} className="text-blue-500 hover:underline">
                    مشاهده
                </a>
                </td>
            </tr>
            ))
        )}
        </tbody>
    </table>
    </div>
);
}

// لیست محصولات
function ProductList({ products }) {
    const { canDeleteUsers } = usePermission();

if (canDeleteUsers) {
  // نمایش دکمه حذف
}
    const navigate = useNavigate();
const token = localStorage.getItem("userToken");
const decoded = decodeToken(token);
const userRole = decoded?.role;

useEffect(() => {
if (userRole !== "admin") {
    navigate("/unauthorized");
}
}, [userRole, navigate]);
return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
    {products.map((product) => (
        <div key={product._id} className="overflow-hidden transition border rounded shadow hover:shadow-md">
        <img src={product.image || "/images/placeholder.jpg"} alt={product.name} className="object-cover w-full h-40" />
        <div className="p-4">
            <h4 className="font-semibold">{product.name}</h4>
            <p className="mt-1 text-gray-600">{product.price.toLocaleString()} تومان</p>
            <div className="mt-2">
            <span
                className={`inline-block px-2 py-1 text-xs rounded ${getStatusColor(product.status, "productStatuses")}`}
            >
                {getStatusLabel(product.status, "productStatuses")}
            </span>
            </div>
            <a href={`/admin/edit-product/${product._id}`} className="block mt-4">
            <button className="w-full px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600">
                ویرایش
            </button>
            </a>
        </div>
        </div>
    ))}
    </div>
);
}

<HasPermission permission="delete_users">
    <button className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600">
        حذف کاربران
    </button>
    </HasPermission>