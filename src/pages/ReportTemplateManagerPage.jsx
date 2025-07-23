import React, { useEffect, useState } from "react";
import axios from "axios";

export default function ReportTemplateManagerPage() {
const [templates, setTemplates] = useState([]);
const [loading, setLoading] = useState(true);
const [showModal, setShowModal] = useState(false);
const [editingTemplate, setEditingTemplate] = useState(null);

  // فرم قالب
const [formData, setFormData] = useState({
    name: "",
    title: "",
    sections: [],
    defaultFormat: "pdf",
    includeCharts: true,
    includeSummary: true,
});

useEffect(() => {
    fetchTemplates();
}, [ setLoading, setTemplates, setShowModal, setEditingTemplate, setFormData]);

const fetchTemplates = async () => {
    try {
    const token = localStorage.getItem("adminToken");
    const res = await axios.get("http://localhost:5000/api/admin/reports/templates", {
        headers: { Authorization: `Bearer ${token}` },
    });
    setTemplates(res.data.data || []);
    } catch (err) {
    console.error(err);
    } finally {
    setLoading(false);
    }
};

const handleAdd = () => {
    setFormData({
    name: "",
    title: "",
    sections: ["summary", "logs", "charts"],
    defaultFormat: "pdf",
    includeCharts: true,
    includeSummary: true,
    });
    setEditingTemplate(null);
    setShowModal(true);
};

const handleEdit = (template) => {
    setFormData({
    name: template.name,
    title: template.title,
    sections: template.sections || [],
    defaultFormat: template.defaultFormat || "pdf",
    includeCharts: template.includeCharts ?? true,
    includeSummary: template.includeSummary ?? true,
    });
    setEditingTemplate(template);
    setShowModal(true);
};

const handleSubmit = async () => {
    try {
    const token = localStorage.getItem("adminToken");
    const url = editingTemplate
        ? `http://localhost:5000/api/admin/reports/templates/${editingTemplate._id}`
        : "http://localhost:5000/api/admin/reports/templates";

    const method = editingTemplate ? "PUT" : "POST";
    const res = await axios[method](url, formData, {
        headers: { Authorization: `Bearer ${token}` },
    });

    if (editingTemplate) {
        setTemplates(templates.map(t => t._id === res.data.data._id ? res.data.data : t));
    } else {
        setTemplates([res.data.data, ...templates]);
    }

    setShowModal(false);
    } catch (err) {
    alert("خطا در ذخیره قالب.");
    console.error(err);
    }
};

const handleDelete = async (id) => {
    if (!window.confirm("آیا مطمئن هستید؟")) return;

    try {
    const token = localStorage.getItem("adminToken");
    await axios.delete(`http://localhost:5000/api/admin/reports/templates/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    setTemplates(templates.filter(t => t._id !== id));
    } catch (err) {
    alert("خطا در حذف قالب.");
    console.error(err);
    }
};

return (
    <div className="container py-10 mx-auto">
    <h2 className="mb-6 text-3xl font-bold">مدیریت قالب‌های گزارش</h2>

      {/* دکمه افزودن */}
    <div className="flex justify-end mb-6">
        <button
        onClick={handleAdd}
        className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
        >
        افزودن قالب جدید
        </button>
    </div>

      {/* لیست قالب‌ها */}
    <div className="overflow-hidden bg-white rounded shadow">
        {loading ? (
        <p className="p-6 text-center">در حال بارگذاری...</p>
        ) : templates.length === 0 ? (
        <p className="p-6 text-center text-gray-500">هیچ قالبی وجود ندارد.</p>
        ) : (
        <table className="min-w-full">
            <thead className="bg-gray-100">
            <tr>
                <th className="px-4 py-2 text-left border-b">نام</th>
                <th className="px-4 py-2 text-left border-b">عنوان</th>
                <th className="px-4 py-2 text-left border-b">بخش‌ها</th>
                <th className="px-4 py-2 text-left border-b">فرمت پیش‌فرض</th>
                <th className="px-4 py-2 text-left border-b">عملیات</th>
            </tr>
            </thead>
            <tbody>
            {templates.map((t) => (
                <tr key={t._id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border-b">{t.name}</td>
                <td className="px-4 py-2 border-b">{t.title}</td>
                <td className="px-4 py-2 border-b">
                    {t.sections.map(s => getSectionLabel(s)).join("، ")}
                </td>
                <td className="px-4 py-2 border-b">{t.defaultFormat.toUpperCase()}</td>
                <td className="flex px-4 py-2 space-x-2 space-x-reverse border-b">
                    <button
                    onClick={() => handleEdit(t)}
                    className="text-blue-500 hover:underline"
                    >
                    ویرایش
                    </button>
                    <button
                    onClick={() => handleDelete(t._id)}
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
    </div>

      {/* مدال افزودن/ویرایش */}
    {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="w-full max-w-md p-6 bg-white rounded shadow-lg">
            <h3 className="mb-4 text-xl font-semibold">
            {editingTemplate ? "ویرایش قالب" : "افزودن قالب جدید"}
            </h3>

            <div className="space-y-4">
            <div>
                <label className="block mb-2 text-gray-700">نام قالب</label>
                <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border rounded"
                />
            </div>

            <div>
                <label className="block mb-2 text-gray-700">عنوان گزارش</label>
                <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border rounded"
                />
            </div>

            <div>
                <label className="block mb-2 text-gray-700">بخش‌های گزارش</label>
                {["summary", "logs", "charts", "audit"].map((section) => (
                <label key={section} className="flex items-center mb-1 space-x-2 space-x-reverse">
                    <input
                    type="checkbox"
                    checked={formData.sections.includes(section)}
                    onChange={(e) => {
                        const updated = e.target.checked
                        ? [...formData.sections, section]
                        : formData.sections.filter(s => s !== section);
                        setFormData({ ...formData, sections: updated });
                    }}
                    />
                    <span>{getSectionLabel(section)}</span>
                </label>
                ))}
            </div>

            <div>
                <label className="block mb-2 text-gray-700">فرمت پیش‌فرض</label>
                <select
                value={formData.defaultFormat}
                onChange={(e) => setFormData({ ...formData, defaultFormat: e.target.value })}
                className="w-full px-3 py-2 border rounded"
                >
                <option value="pdf">PDF</option>
                <option value="excel">Excel</option>
                </select>
            </div>

            <div className="flex items-center">
                <input
                type="checkbox"
                checked={formData.includeSummary}
                onChange={(e) => setFormData({ ...formData, includeSummary: e.target.checked })}
                />
                <span className="mr-2">گنجاندن خلاصه</span>
            </div>

            <div className="flex items-center">
                <input
                type="checkbox"
                checked={formData.includeCharts}
                onChange={(e) => setFormData({ ...formData, includeCharts: e.target.checked })}
                />
                <span className="mr-2">گنجاندن نمودارها</span>
            </div>
            </div>

            <div className="flex justify-end mt-6 space-x-4 space-x-reverse">
            <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
                لغو
            </button>
            <button
                onClick={handleSubmit}
                className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
            >
                ذخیره
            </button>
            </div>
        </div>
        </div>
    )}
    </div>
);
}

// توابع کمکی
function getSectionLabel(section) {
const labels = {
    summary: "خلاصه",
    logs: "لاگ‌ها",
    charts: "نمودارها",
    audit: "سیستم لاگ",
};
return labels[section] || section;
}