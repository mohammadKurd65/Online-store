import React, { useEffect, useState } from "react";
import axios from "axios";
import DeleteModal from "../components/DeleteModal";
import SkeletonLoader from "../components/SkeletonLoader";
import Pagination from "../components/Pagination";
import UpdateRoleForm from "../components/UpdateRoleForm";

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
const params = new URLSearchParams();
params.append("page", page);
params.append("limit", 5);
if (roleFilter) params.append("role", roleFilter);
if (startDate) params.append("startDate", startDate);
if (endDate) params.append("endDate", endDate);



const filteredAdmins = admins.filter((admin) =>
admin.username.toLowerCase().includes(searchTerm.toLowerCase())
);

useEffect(() => {
const fetchAdmins = async () => {
try {
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
}, [page]);


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
    <div className="flex flex-col gap-4 mb-6 md:flex-row">
  {/* جستجو */}
<input
    type="text"
    placeholder="جستجوی نام کاربری..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className="w-full px-4 py-2 border rounded md:w-1/3"
/>

  {/* فیلتر نقش */}
<select
    value={roleFilter}
    onChange={(e) => {
    setRoleFilter(e.target.value);
    setPage(1);
    }}
    className="w-full px-4 py-2 border rounded md:w-1/4"
>
    <option value="">همه نقش‌ها</option>
    <option value="admin">ادمین</option>
    <option value="editor">ویرایشگر</option>
    <option value="viewer">مشاهده‌گر</option>
</select>

  {/* فیلتر تاریخ شروع */}
<input
    type="date"
    value={startDate}
    onChange={(e) => {
    setStartDate(e.target.value);
    setPage(1);
    }}
    className="w-full px-4 py-2 border rounded md:w-1/4"
/>

  {/* فیلتر تاریخ پایان */}
<input
    type="date"
    value={endDate}
    onChange={(e) => {
    setEndDate(e.target.value);
    setPage(1);
    }}
    className="w-full px-4 py-2 border rounded md:w-1/4"
/>
</div>

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
        <td className="px-4 py-2 capitalize border-b">{admin.role}</td>
        <td className="px-4 py-2 border-b">{admin._id}</td>
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


