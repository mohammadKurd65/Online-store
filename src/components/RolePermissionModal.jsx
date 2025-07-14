import React from "react";

export default function RolePermissionModal({ isOpen, onClose, role, permissions = [], onPermissionsChange }) {
if (!isOpen) return null;

const allPermissions = [
    { key: "view_dashboard", label: "مشاهده داشبورد" },
    { key: "edit_profile", label: "ویرایش پروفایل" },
    { key: "edit_products", label: "ویرایش محصولات" },
    { key: "delete_users", label: "حذف کاربران" },
    { key: "manage_orders", label: "مدیریت سفارشات" },
    { key: "manage_permissions", label: "مدیریت دسترسی‌ها" },
    { key: "view_reports", Label: "مشاهده گزارش ها"}
];


const handlePermissionToggle = (permissionKey) => {
    const updatedPermissions = permissions.includes(permissionKey)
    ? permissions.filter((p) => p !== permissionKey)
    : [...permissions, permissionKey];

    onPermissionsChange(role, updatedPermissions);
};

return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div className="w-full max-w-md p-6 bg-white rounded shadow-lg">
        <h3 className="mb-4 text-xl font-semibold">دسترسی‌های نقش: <span className="capitalize">{role}</span></h3>

        {/* لیست دسترسی‌ها */}
        <div className="space-y-2">
        {allPermissions.map((perm) => (
            <label key={perm.key} className="flex items-center space-x-2 space-x-reverse cursor-pointer">
            <input
                type="checkbox"
                checked={permissions.includes(perm.key)}
                onChange={() => handlePermissionToggle(perm.key)}
                className="w-5 h-5 text-blue-600 form-checkbox"
            />
            <span>{perm.label}</span>
            </label>
        ))}
        </div>

        {/* دکمه‌ها */}
        <div className="flex justify-end mt-6 space-x-4 space-x-reverse">
        <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
        >
            لغو
        </button>
        <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
        >
            ذخیره
        </button>
        </div>
    </div>
    </div>
);
}