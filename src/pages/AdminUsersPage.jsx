import React, { useEffect, useState } from "react";
import axios from "axios";
import DeleteModal from "../components/DeleteModal";
import SkeletonLoader from "../components/SkeletonLoader";
import Pagination from "../components/Pagination"

export default function AdminUsersPage() {
const [admins, setAdmins] = useState([]);
const [loading, setLoading] = useState(true);
const [page, setPage] = useState(1);
const [totalPages, setTotalPages] = useState(1);
const [showModal, setShowModal] = useState(false);
const [selectedAdmin, setSelectedAdmin] = useState(null);
const [searchTerm, setSearchTerm] = useState("");

const filteredAdmins = admins.filter((admin) =>
admin.username.toLowerCase().includes(searchTerm.toLowerCase())
);

useEffect(() => {
const fetchAdmins = async () => {
    try {
    const token = localStorage.getItem("adminToken");
    const res = await axios.get(`http://localhost:5000/api/admin/admins?page=${page}&limit=5`, {
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
    <div className="mb-6">
    <input
        type="text"
        placeholder="جستجوی نام کاربری..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full px-4 py-2 border rounded md:w-1/2"
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
            <th className="px-4 py-2 text-left border-b">شناسه</th>
            <th className="px-4 py-2 text-left border-b">عملیات</th>
            </tr>
        </thead>
        <tbody>
            {admins.map((admin, index) => (
            <tr key={index} className="hover:bg-gray-50">
                <td className="px-4 py-2 border-b">{admin.username}</td>
                <td className="px-4 py-2 border-b">{admin._id}</td>
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


