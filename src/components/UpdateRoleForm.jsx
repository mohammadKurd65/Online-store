import React, { useState } from "react";
import axios from "axios";

export default function UpdateRoleForm({ admin, onRoleUpdated }) {
const [role, setRole] = useState(admin.role || "admin");
const [loading, setLoading] = useState(false);

const handleUpdate = async () => {
    setLoading(true);
    try {
    const token = localStorage.getItem("adminToken");
    const res = await axios.put(
        `http://localhost:5000/api/admin/admins/${admin._id}/role`,
        { role },
        {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        }
    );

    onRoleUpdated(res.data.data);
    } catch (err) {
    alert("خطا در آپدیت نقش.");
    console.error(err);
    } finally {
    setLoading(false);
    }
};

return (
    <div className="flex items-center space-x-2 space-x-reverse">
    <select
        value={role}
        onChange={(e) => setRole(e.target.value)}
        className="px-3 py-1 text-sm border rounded"
    >
        <option value="admin">ادمین</option>
        <option value="editor">ویرایشگر</option>
        <option value="viewer">مشاهده‌گر</option>
    </select>
    <button
        onClick={handleUpdate}
        disabled={loading}
        className={`bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
    >
        {loading ? "در حال ذخیره..." : "ذخیره"}
    </button>
    </div>
);
}