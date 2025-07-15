import React from "react";
import useTranslation from "../hooks/useTranslation";
import { useState } from "react";

export default function RolePermissionModal({ isOpen, onClose, role, permissions, onPermissionsChange }) {
const { t } = useTranslation();
const [currentPermissions, setCurrentPermissions] = useState(permissions);

if (!isOpen) return null;

return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div className="w-full max-w-md p-6 bg-white rounded shadow-lg">
        <h3 className="mb-4 text-xl font-semibold">دسترسی‌های نقش: {t.roles[role]}</h3>

        {/* لیست دسترسی‌ها */}
        <div className="space-y-2">
        {Object.keys(t.permissions).map((permKey) => (
            <label key={permKey} className="flex items-center space-x-2 space-x-reverse">
            <input
                type="checkbox"
                checked={currentPermissions.includes(permKey)}
                onChange={() => {
                const updated = currentPermissions.includes(permKey)
                    ? currentPermissions.filter((p) => p !== permKey)
                    : [...currentPermissions, permKey];
                setCurrentPermissions(updated);
                }}
            />
            <span>{t.permissions[permKey]}</span>
            </label>
        ))}
        </div>

        {/* دکمه‌ها */}
        <div className="flex justify-end mt-6 space-x-4 space-x-reverse">
        <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
            {t.buttons.cancel}
        </button>
        <button
            onClick={() => onPermissionsChange(role, currentPermissions)}
            className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
        >
            {t.buttons.save}
        </button>
        </div>
    </div>
    </div>
);
}