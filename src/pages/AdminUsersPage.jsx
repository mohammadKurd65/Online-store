import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AdminUsersPage() {
const [admins, setAdmins] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
    const fetchAdmins = async () => {
    try {
        const token = localStorage.getItem("adminToken");
        const res = await axios.get("http://localhost:5000/api/admin/admins", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        });
        setAdmins(res.data.data);
    } catch (err) {
        console.error(err);
    } finally {
        setLoading(false);
    }
    };

    fetchAdmins();
}, []);

if (loading) {
    return <p>در حال بارگذاری...</p>;
}


return (
    <div className="container py-10 mx-auto">
    <h2 className="mb-6 text-2xl font-bold">لیست ادمین‌ها</h2>

    {admins.length === 0 ? (
        <p>ادمینی یافت نشد.</p>
    ) : (
        <table className="min-w-full bg-white border rounded shadow">
        <thead className="bg-gray-100">
            <tr>
            <th className="px-4 py-2 text-left border-b">نام کاربری</th>
            <th className="px-4 py-2 text-left border-b">شناسه</th>
            </tr>
        </thead>
        <tbody>
            {admins.map((admin, index) => (
            <tr key={index} className="hover:bg-gray-50">
                <td className="px-4 py-2 border-b">{admin.username}</td>
                <td className="px-4 py-2 border-b">{admin._id}</td>
            </tr>
            ))}
        </tbody>
        </table>
    )}
    </div>
);
}