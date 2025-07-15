import React, { useState } from "react";
import axios from "axios";
import HasPermission from "../components/HasPermission";
import { usePermission } from "../hooks/usePermission";
import RolePermissionModal from "../components/RolePermissionModal";
import useTranslation from "../hooks/useTranslation";


export default function PermissionManagementPage() {
    const { t, lang, setLang } = useTranslation();
    const { canDeleteUsers } = usePermission();

if (canDeleteUsers) {
  // نمایش دکمه حذف
}
const [roles, setRoles] = useState([
    {
    name: "user",
    permissions: ["view_dashboard", "edit_profile"],
    },
    {
    name: "editor",
    permissions: ["view_dashboard", "edit_profile", "edit_products"],
    },
    {
    name: "admin",
    permissions: ["view_dashboard", "edit_profile", "edit_products", "delete_users", "manage_permissions"],
    },
]);

const allPermissions = [
    "view_dashboard",
    "edit_profile",
    "edit_products",
    "delete_users",
    "manage_orders",
    "manage_permissions",
];

const permissionLabels = {
    view_dashboard: "مشاهده داشبورد",
    edit_profile: "ویرایش پروفایل",
    edit_products: "ویرایش محصولات",
    delete_users: "حذف کاربران",
    manage_orders: "مدیریت سفارشات",
    manage_permissions: "مدیریت دسترسی‌ها",
};

const [showModal, setShowModal] = useState(false);
const [selectedRole, setSelectedRole] = useState(null);
const [rolePermissions, setRolePermissions] = useState([]);

const openRoleModal = (roleName) => {
const role = roles.find((r) => r.name === roleName);
setSelectedRole(roleName);
setRolePermissions(role?.permissions || []);
setShowModal(true);
};

const saveRolePermissions = async () => {
try {
    const token = localStorage.getItem("adminToken");
    await axios.put(
    `http://localhost:5000/api/admin/permissions/${selectedRole}`,
    { permissions: rolePermissions },
    {
        headers: {
        Authorization: `Bearer ${token}`,
        },
    }
    );

    setRoles((prevRoles) =>
    prevRoles.map((r) =>
        r.name === selectedRole
        ? { ...r, permissions: rolePermissions }
        : r
    )
    );

    setShowModal(false);
    alert("دسترسی‌ها آپدیت شد.");
} catch (err) {
    alert("خطا در آپدیت دسترسی‌ها.");
    console.error(err);
}
};

const handlePermissionChange = (roleName, permission) => {
    setRoles((prevRoles) =>
    prevRoles.map((role) => {
        if (role.name === roleName) {
        const hasPermission = role.permissions.includes(permission);
        return {
            ...role,
            permissions: hasPermission
            ? role.permissions.filter((p) => p !== permission)
            : [...role.permissions, permission],
        };
        }
        return role;
    })
    );
};

const savePermissions = async () => {
    try {
    const token = localStorage.getItem("adminToken");
    await axios.put(`http://localhost:5000/api/admin/permissions`, { roles }, {
        headers: {
        Authorization: `Bearer ${token}`,
        },
    });
    alert("دسترسی‌ها با موفقیت ذخیره شدند.");
    } catch (err) {
    alert("خطا در ذخیره دسترسی‌ها.");
    console.error(err);
    }
};
const { role } = usePermission();
return (
    <div className="container py-10 mx-auto">
        <h2 className="mb-6 text-3xl font-bold">{t.dashboard.title}</h2>

      {/* تغییر زبان */}
    <select
        value={lang}
        onChange={(e) => setLang(e.target.value)}
        className="px-3 py-2 mb-4 border rounded"
    >
        <option value="fa">فارسی</option>
        <option value="en">انگلیسی</option>
    </select>

      {/* نمایش دسترسی‌ها با زبان فعلی */}
    <p>سلام، شما نقش {t.roles[role] || role} رو دارید.</p>
        
        
    <h2 className="mb-6 text-3xl font-bold">مدیریت دسترسی‌ها</h2>

    <div className="p-6 mb-8 bg-white rounded shadow">
        <h3 className="mb-4 text-xl font-semibold">دسترسی‌های نقش‌ها</h3>
        
        {/* جدول دسترسی‌ها */}
        <table className="min-w-full bg-white border rounded shadow">
        <thead className="bg-gray-100">
            <tr>
            <th className="px-4 py-2 text-left border-b">نقش</th>
            {allPermissions.map((perm) => (
                <th key={perm} className="px-4 py-2 text-center border-b">
                {permissionLabels[perm]}
                </th>
            ))}
            </tr>
        </thead>
        <tbody>
            {roles.map((role) => (
            <tr key={role.name} className="hover:bg-gray-50">
                <td className="px-4 py-2 font-medium capitalize border-b">{role.name}</td>
                {allPermissions.map((perm) => (
                <td key={`${role.name}-${perm}`} className="px-4 py-2 text-center border-b">
                    <input
                    type="checkbox"
                    checked={role.permissions.includes(perm)}
                    onChange={() => handlePermissionChange(role.name, perm)}
                    disabled={role.name === "user" && perm === "manage_permissions"}
                    className="w-5 h-5 text-blue-600 form-checkbox"
                    />
                </td>
                ))}
            </tr>
            ))}
        </tbody>
        </table>

        {/* دکمه ذخیره */}
        <div className="flex justify-end mt-6">
        <button
            onClick={savePermissions}
            className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
        >
            ذخیره دسترسی‌ها
        </button>
        </div>
        <HasPermission permission="delete_users">
                                        <button className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600">
                                            حذف کاربران
                                        </button>
                                        </HasPermission>

                                        {/* مدال تنظیم دسترسی‌ها */}
<RolePermissionModal
isOpen={showModal}
onClose={() => setShowModal(false)}
role={selectedRole}
permissions={rolePermissions}
onPermissionsChange={(roleName, newPermissions) => {
    setRolePermissions(newPermissions);
}}
/>

{/* لیست نقش‌ها */}
<div className="grid grid-cols-1 gap-4 mb-8 md:grid-cols-3">
{roles.map((role) => (
    <div key={role.name} className="flex flex-col justify-between p-4 border rounded shadow">
    <h3 className="text-lg font-semibold capitalize">{role.name}</h3>
    <ul className="mt-2 text-sm text-gray-700">
        {role.permissions.map((p) => (
        <li key={p}>{permissionLabels[p]}</li>
        ))}
    </ul>
    <button
        onClick={() => openRoleModal(role.name)}
        className="self-start px-4 py-1 mt-4 text-white bg-blue-500 rounded hover:bg-blue-600"
    >
        تنظیم دسترسی
    </button>
    </div>
))}
</div>
    </div>
    </div>
);
}