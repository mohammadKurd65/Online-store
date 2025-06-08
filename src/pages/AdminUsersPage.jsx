import React, { useEffect, useState } from "react";
import axios from "axios";
import DeleteModal from "../components/DeleteModal";
import SkeletonLoader from "../components/SkeletonLoader";
import Pagination from "../components/Pagination";
import UpdateRoleForm from "../components/UpdateRoleForm";
import ReusableFilterForm from "../components/ReusableFilterForm";
import usePersistedFilter from "../hooks/usePersistedFilter";
import { getStatusLabel, getStatusColor } from "../utils/statusManager";


export default function AdminUsersPage() {
const [admins, setAdmins] = useState([]);
const [loading, setLoading] = useState(true);
const [page, setPage] = useState(1);
const [totalPages, setTotalPages] = useState(1);
const [showModal, setShowModal] = useState(false);
const [selectedAdmin, setSelectedAdmin] = useState(null);
const [searchTerm, setSearchTerm] = useState("");
const [roleFilter, setRoleFilter] = useState("");
const [startDate, setStartDate] = useState("");
const [endDate, setEndDate] = useState("");
const [filters, setFilters] = usePersistedFilter("admin-users-filter", {
searchTerm: "",
role: "",
startDate: "",
endDate: "",
});
const params = new URLSearchParams();
params.append("page", page);
params.append("limit", 5);
if (roleFilter) params.append("role", roleFilter);
if (startDate) params.append("startDate", startDate);
if (endDate) params.append("endDate", endDate);

const filteredAdmins = admins.filter((admin) =>
admin.username.toLowerCase().includes(searchTerm.toLowerCase())
);

// قبل از useEffect


useEffect(() => {
const fetchAdmins = async () => {
try {
    const params = new URLSearchParams();
    params.append("page", page);
    if (filters.role) params.append("role", filters.role);
    if (filters.startDate) params.append("startDate", filters.startDate);
    if (filters.endDate) params.append("endDate", filters.endDate);

    const token = localStorage.getItem("adminToken");
    const res = await axios.get(`http://localhost:5000/api/admin/admins?${params}`, {
    headers: {
        Authorization: `Bearer ${token}`,
    },
    });

    setAdmins(res.data.data);
    setTotalPages(res.data.pagination.totalPages);
} catch (err) {
    console.error(err);
} finally {
    setLoading(false);
}
};

fetchAdmins();
}, [page, filters]);

const handleRoleChange = (value) => {
setRoleFilter(value);
setPage(1);
};

const handleStartDateChange = (value) => {
setStartDate(value);
setPage(1);
};

const handleEndDateChange = (value) => {
setEndDate(value);
setPage(1);
};

const handleSearchTermChange = (value) => {
setSearchTerm(value);
};


const handleDeleteClick = (admin) => {
    setSelectedAdmin(admin);
    setShowModal(true);
};

const handleDeleteConfirm = async () => {
    try {
    const token = localStorage.getItem("adminToken");
    await axios.delete(
        `http://localhost:5000/api/admin/admins/${selectedAdmin._id}`,
        {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        }
    );

    setAdmins(admins.filter((a) => a._id !== selectedAdmin._id));
    setShowModal(false);
    } catch (err) {
    alert("خطا در حذف ادمین.");
    console.error(err);
    }
};

if (loading) {
    return <p>در حال بارگذاری...</p>;
}

if (loading) {
return <SkeletonLoader type="table" />;
}

return (
    <div className="container py-10 mx-auto">
    <h2 className="mb-6 text-2xl font-bold">لیست ادمین‌ها</h2>

    {/* فیلد جستجو */}
<ReusableFilterForm
filters={filters}
onFilterChange={setFilters}
showRole={true}
showStatus={true}
showDateRange={true}
/>

    {/* لیست ادمین‌ها */}
    {loading ? (
    <SkeletonLoader type="table" />
    ) : filteredAdmins.length === 0 ? (
    <p>ادمینی یافت نشد.</p>
    ) : (
<table className="min-w-full bg-white border rounded shadow">
<thead className="bg-gray-100">
    <tr>
    <th className="px-4 py-2 text-left border-b">نام کاربری</th>
    <th className="px-4 py-2 text-left border-b">نقش</th>
    <th className="px-4 py-2 text-left border-b">شناسه</th>
    <th className="px-4 py-2 text-left border-b">آپدیت نقش</th>
    <th className="px-4 py-2 text-left border-b">عملیات</th>
    </tr>
</thead>
<tbody>
    {filteredAdmins.map((admin, index) => (
    <tr key={index} className="hover:bg-gray-50">
        <td className="px-4 py-2 border-b">{admin.username}</td>
        <td className="px-4 py-2 capitalize border-b">
                <span className={`inline-block px-3 py-1 rounded-full text-sm ${getStatusColor(admin.role, "adminRoles")}`}>
{getStatusLabel(admin.role, "adminRoles")}
</span>
        </td>
        <td className="px-4 py-2 border-b">{admin._id}</td>
        <td className="px-4 py-2 border-b">
<span className={`inline-block px-3 py-1 rounded-full text-sm ${getStatusColor(filters.role, "adminRoles")}`}>
    {getStatusLabel(filters.role, "adminRoles")}
</span>
</td>
        <td className="px-4 py-2 border-b">
        <UpdateRoleForm
            admin={admin}
            onRoleUpdated={(updatedAdmin) => {
            const updatedList = admins.map((a) =>
                a._id === updatedAdmin._id ? updatedAdmin : a
            );
            setAdmins(updatedList);
            }}
        />
        </td>
        <td className="px-4 py-2 border-b">
        <button
            onClick={() => handleDeleteClick(admin)}
            className="text-red-500 hover:underline"
        >
            حذف
        </button>
        </td>
    </tr>
    ))}
</tbody>
        </table>
    )}

     {/* کامپوننت Pagination */}
        <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={(newPage) => setPage(newPage)}
        />

      {/* مدال حذف */}
    <DeleteModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleDeleteConfirm}
        itemName={selectedAdmin?.username || "ادمین"}
    />
    
    </div>
);
}


