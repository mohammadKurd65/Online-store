import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getStatusColor, getStatusLabel } from "../utils/statusManager";
import { Pie, Line } from "react-chartjs-2";
import {
Chart as ChartJS,
ArcElement,
Tooltip,
Legend,
CategoryScale,
LinearScale,
PointElement,
LineElement,
Title,
} from "chart.js";
ChartJS.register(
ArcElement,
Tooltip,
Legend,
CategoryScale,
LinearScale,
PointElement,
LineElement,
Title
);
import UserStatusBarChart from "../components/UserStatusBarChart";
import AdvancedUserFilterForm from "../components/AdvancedUserFilterForm";
import Pagination from "../components/Pagination";
import UserActivityChart from "../components/UserActivityChart";

export default function AdminUserManagementPage() {
const navigate = useNavigate();
const [users, setUsers] = useState([]);
const [allUsers, setAllUsers] = useState([]);
const [loading, setLoading] = useState(true);
const [searchTerm, setSearchTerm] = useState("");
const [showDeleteModal, setShowDeleteModal] = useState(false);
const [selectedUser, setSelectedUser] = useState(null);
const [filters, setFilters] = useState({
    role: "",
    status: "",
    startDate: "",
    endDate: "",
});
const [page, setPage] = useState(1);
const [totalPages, setTotalPages] = useState(1);

  // دریافت همه کاربران برای نمودارها
useEffect(() => {
    const fetchAllUsersForChart = async () => {
    try {
        const token = localStorage.getItem("adminToken");
        const res = await axios.get("http://localhost:5000/api/admin/users", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        });
        setAllUsers(res.data.data || []);
    } catch (err) {
        console.error(err);
    }
    };
    fetchAllUsersForChart();
}, []);

  // دریافت کاربران صفحه فعلی با فیلتر و جستجو
useEffect(() => {
    const fetchUsers = async () => {
    setLoading(true);
    try {
        const token = localStorage.getItem("adminToken");
        const params = new URLSearchParams();
        if (filters.role) params.append("role", filters.role);
        if (filters.status) params.append("status", filters.status);
        if (filters.startDate) params.append("startDate", filters.startDate);
        if (filters.endDate) params.append("endDate", filters.endDate);
        if (searchTerm) params.append("search", searchTerm);
        params.append("page", page);
        params.append("limit", 10);

        const res = await axios.get(
        `http://localhost:5000/api/admin/users?${params}`,
        {
            headers: {
            Authorization: `Bearer ${token}`,
            },
        }
        );
        setUsers(res.data.data || []);
        setTotalPages(
        res.data.pagination
            ? res.data.pagination.totalPages
            : Math.ceil((res.headers["x-total-count"] || 0) / 10)
        );
    } catch (err) {
        console.error(err);
    }
    setLoading(false);
    };
    fetchUsers();
}, [filters, searchTerm, page]);

  // ریست صفحه هنگام تغییر فیلترها
useEffect(() => {
    setPage(1);
}, [filters, searchTerm]);

const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
};

const handleDeleteConfirm = async () => {
    try {
    const token = localStorage.getItem("adminToken");
    await axios.delete(
        `http://localhost:5000/api/admin/users/${selectedUser._id}`,
        {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        }
    );
    setUsers(users.filter((u) => u._id !== selectedUser._id));
    setShowDeleteModal(false);
    } catch (err) {
    alert("خطا در حذف کاربر.");
    console.error(err);
    }
};

return (
    <div className="container py-10 mx-auto">
    <h2 className="mb-6 text-3xl font-bold">مدیریت کاربران</h2>

      {/* فرم فیلتر پیشرفته */}
    <AdvancedUserFilterForm filters={filters} onFilterChange={setFilters} />

      {/* جستجو و فیلترها */}
    <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <input
        type="text"
        placeholder="جستجوی نام کاربری..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full px-4 py-2 border rounded md:w-1/2"
        />

        <select
        value={filters.role}
        onChange={(e) =>
            setFilters((prev) => ({ ...prev, role: e.target.value }))
        }
        className="w-full px-3 py-2 border rounded md:w-1/4"
        >
        <option value="">همه نقش‌ها</option>
        <option value="user">کاربر عادی</option>
        <option value="editor">ویرایشگر</option>
        <option value="admin">ادمین</option>
        </select>

        <select
        value={filters.status}
        onChange={(e) =>
            setFilters((prev) => ({ ...prev, status: e.target.value }))
        }
        className="w-full px-3 py-2 border rounded md:w-1/4"
        >
        <option value="">همه وضعیت‌ها</option>
        <option value="active">فعال</option>
        <option value="inactive">غیرفعال</option>
        <option value="blocked">مسدود</option>
        </select>

        {/* فیلتر تاریخ ثبت‌نام */}
        <div className="flex flex-col w-full gap-4 md:flex-row">
        <div className="w-full md:w-1/2">
            <label className="block mb-1 text-sm text-gray-700">از تاریخ</label>
            <input
            type="date"
            value={filters.startDate}
            onChange={(e) =>
                setFilters((prev) => ({
                ...prev,
                startDate: e.target.value,
                }))
            }
            className="w-full px-3 py-2 border rounded"
            />
        </div>
        <div className="w-full md:w-1/2">
            <label className="block mb-1 text-sm text-gray-700">تا تاریخ</label>
            <input
            type="date"
            value={filters.endDate}
            onChange={(e) =>
                setFilters((prev) => ({
                ...prev,
                endDate: e.target.value,
                }))
            }
            className="w-full px-3 py-2 border rounded"
            />
        </div>
        </div>

        <button
        onClick={() => navigate("/admin/add-user")}
        className="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600"
        >
        افزودن کاربر
        </button>
    </div>

      {/* لیست کاربران */}
    <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded shadow">
        <thead className="bg-gray-100">
            <tr>
            <th className="px-4 py-2 text-left border-b">نام کاربری</th>
            <th className="px-4 py-2 text-left border-b">نقش</th>
            <th className="px-4 py-2 text-left border-b">وضعیت</th>
            <th className="px-4 py-2 text-left border-b">عملیات</th>
            </tr>
        </thead>
        <tbody>
            {users.length === 0 ? (
            <tr>
                <td colSpan="4" className="py-4 text-center">
                کاربری یافت نشد.
                </td>
            </tr>
            ) : (
            users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border-b">{user.username}</td>
                <td className="px-4 py-2 capitalize border-b">{user.role}</td>
                <td className="px-4 py-2 border-b">
                    <span
                    className={`inline-block px-3 py-1 rounded-full text-sm ${getStatusColor(
                        user.status,
                        "userStatus"
                    )}`}
                    >
                    {getStatusLabel(user.status, "userStatus")}
                    </span>
                </td>
                <td className="flex px-4 py-2 space-x-2 space-x-reverse border-b">
                    <button
                    onClick={() => navigate(`/admin/edit-user/${user._id}`)}
                    className="text-blue-500 hover:underline"
                    >
                    ویرایش
                    </button>
                    <button
                    onClick={() => handleDeleteClick(user)}
                    className="text-red-500 hover:underline"
                    >
                    حذف
                    </button>
                </td>
                </tr>
            ))
            )}
        </tbody>
        </table>

        {/* صفحه‌بندی */}
        <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={(newPage) => setPage(newPage)}
        />
    </div>

      {/* نمودار توزیع نقش کاربران */}
    <div className="p-6 mb-8 bg-white rounded shadow">
        <h3 className="mb-4 text-xl font-semibold">توزیع نقش کاربران</h3>
        <div className="max-w-lg mx-auto">
        <UserRolesPieChart users={allUsers} />
        </div>
    </div>

      {/* نمودار روند ثبت‌نام */}
    <div className="p-6 mb-8 bg-white rounded shadow">
        <h3 className="mb-4 text-xl font-semibold">روند ثبت‌نام کاربران</h3>
        <UserRegistrationTrend users={allUsers} />
    </div>

      {/* نمودار ستونی وضعیت کاربران */}
    <div className="p-6 mb-8 bg-white rounded shadow">
        <h3 className="mb-4 text-xl font-semibold">نمودار وضعیت کاربران</h3>
        <div className="max-w-lg mx-auto">
        <UserStatusBarChart users={allUsers} />
        </div>
    </div>

      {/* نمودار فعالیت */}
    <div className="p-6 mb-8 bg-white rounded shadow">
        <h3 className="mb-4 text-xl font-semibold">روند ثبت‌نام کاربران</h3>
        <div className="max-w-2xl mx-auto">
        <UserActivityChart users={allUsers} />
        </div>
    </div>

      {/* مدال حذف */}
    {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="w-full max-w-md p-6 bg-white rounded shadow-lg">
            <h3 className="mb-4 text-lg font-semibold">حذف کاربر</h3>
            <p className="mb-6">آیا مطمئن هستید؟ این عمل غیرقابل بازگشت است.</p>
            <div className="flex justify-end space-x-4 space-x-reverse">
            <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
                لغو
            </button>
            <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
            >
                حذف
            </button>
            </div>
        </div>
        </div>
    )}
    </div>
);
}

// نمودار دایره‌ای نقش کاربران
function UserRolesPieChart({ users }) {
const roleCount = {
    user: 0,
    editor: 0,
    admin: 0,
};

users.forEach((u) => {
    if (roleCount[u.role] !== undefined) {
    roleCount[u.role]++;
    }
});

const data = {
    labels: ["کاربر عادی", "ویرایشگر", "ادمین"],
    datasets: [
    {
        label: "تعداد",
        data: [roleCount.user, roleCount.editor, roleCount.admin],
        backgroundColor: ["#3b82f6", "#10b981", "#8b5cf6"],
        borderColor: ["#1e40af", "#047857", "#7c3aed"],
        borderWidth: 1,
    },
    ],
};

const options = {
    responsive: true,
    plugins: {
    legend: {
        position: "right",
    },
    title: {
        display: true,
        text: "توزیع نقش کاربران",
    },
    },
};

return <Pie data={data} options={options} />;
}

// نمودار خطی روند ثبت‌نام کاربران
function UserRegistrationTrend({ users }) {
const monthlyUsers = {};

users.forEach((user) => {
    const date = new Date(user.createdAt);
    const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    if (!monthlyUsers[month]) monthlyUsers[month] = 0;
    monthlyUsers[month]++;
});

const labels = Object.keys(monthlyUsers).sort();
const data = Object.values(monthlyUsers);

const chartData = {
    labels,
    datasets: [
    {
        label: "کاربران جدید",
        data: data,
        fill: false,
        borderColor: "#3b82f6",
        tension: 0.4,
        pointRadius: 3,
        backgroundColor: "#3b82f6",
    },
    ],
};

const options = {
    responsive: true,
    plugins: {
    legend: { display: false },
    title: {
        display: true,
        text: "روند ثبت‌نام کاربران",
    },
    },
};

return <Line data={chartData} options={options} />;
}