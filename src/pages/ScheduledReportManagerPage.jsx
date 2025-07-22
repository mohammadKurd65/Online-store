import React, { useEffect, useState } from "react";
import axios from "axios";

export default function ScheduledReportManagerPage() {
const [reports, setReports] = useState([]);
const [loading, setLoading] = useState(true);
const [showModal, setShowModal] = useState(false);

  // فرم افزودن گزارش
const [newReport, setNewReport] = useState({
    name: "",
    email: "",
    frequency: "weekly",
    format: "pdf",
    startTime: "09:00",
});

useEffect(() => {
    fetchReports();
}, [ setLoading, setReports, setShowModal, setNewReport]);

const fetchReports = async () => {
    try {
    const token = localStorage.getItem("adminToken");
    const res = await axios.get("http://localhost:5000/api/admin/reports/scheduled", {
        headers: {
        Authorization: `Bearer ${token}`,
        },
    });
    setReports(res.data.data || []);
    } catch (err) {
    console.error(err);
    } finally {
    setLoading(false);
    }
};

const handleAddReport = async () => {
    try {
    const token = localStorage.getItem("adminToken");
    const res = await axios.post(
        "http://localhost:5000/api/admin/reports/scheduled",
        newReport,
        {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        }
    );
    setReports([res.data.data, ...reports]);
    setNewReport({
        name: "",
        email: "",
        frequency: "weekly",
        format: "pdf",
        startTime: "09:00",
    });
    setShowModal(false);
    } catch (err) {
    alert("خطا در افزودن گزارش.");
    console.error(err);
    }
};

const handleDelete = async (id) => {
    try {
    const token = localStorage.getItem("adminToken");
    await axios.delete(`http://localhost:5000/api/admin/reports/scheduled/${id}`, {
        headers: {
        Authorization: `Bearer ${token}`,
        },
    });
    setReports(reports.filter((r) => r._id !== id));
    } catch (err) {
    alert("خطا در حذف گزارش.");
    console.error(err);
    }
};

return (
    <div className="container py-10 mx-auto">
    <h2 className="mb-6 text-3xl font-bold">مدیریت گزارش‌های خودکار</h2>

      {/* دکمه افزودن */}
    <div className="flex justify-end mb-6">
        <button
        onClick={() => setShowModal(true)}
        className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
        >
        افزودن گزارش خودکار
        </button>
    </div>

      {/* لیست گزارش‌ها */}
    <div className="overflow-hidden bg-white rounded shadow">
        {loading ? (
        <p className="p-6 text-center">در حال بارگذاری...</p>
        ) : reports.length === 0 ? (
        <p className="p-6 text-center text-gray-500">هیچ گزارش خودکاری وجود ندارد.</p>
        ) : (
        <table className="min-w-full">
            <thead className="bg-gray-100">
            <tr>
                <th className="px-4 py-2 text-left border-b">نام گزارش</th>
                <th className="px-4 py-2 text-left border-b">ایمیل</th>
                <th className="px-4 py-2 text-left border-b">تناوب</th>
                <th className="px-4 py-2 text-left border-b">فرمت</th>
                <th className="px-4 py-2 text-left border-b">زمان</th>
                <th className="px-4 py-2 text-left border-b">عملیات</th>
            </tr>
            </thead>
            <tbody>
            {reports.map((report) => (
                <tr key={report._id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border-b">{report.name}</td>
                <td className="px-4 py-2 border-b">{report.email}</td>
                <td className="px-4 py-2 border-b">{getFrequencyLabel(report.frequency)}</td>
                <td className="px-4 py-2 border-b">{report.format.toUpperCase()}</td>
                <td className="px-4 py-2 border-b">{report.startTime}</td>
                <td className="px-4 py-2 border-b">
                    <button
                    onClick={() => handleDelete(report._id)}
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

      {/* مدال افزودن */}
    {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="w-full max-w-md p-6 bg-white rounded shadow-lg">
            <h3 className="mb-4 text-xl font-semibold">افزودن گزارش خودکار</h3>

            <div className="space-y-4">
            <div>
                <label className="block mb-2 text-gray-700">نام گزارش</label>
                <input
                type="text"
                value={newReport.name}
                onChange={(e) =>
                    setNewReport({ ...newReport, name: e.target.value })
                }
                className="w-full px-3 py-2 border rounded"
                />
            </div>

            <div>
                <label className="block mb-2 text-gray-700">ایمیل مقصد</label>
                <input
                type="email"
                value={newReport.email}
                onChange={(e) =>
                    setNewReport({ ...newReport, email: e.target.value })
                }
                className="w-full px-3 py-2 border rounded"
                />
            </div>

            <div>
                <label className="block mb-2 text-gray-700">تناوب</label>
                <select
                value={newReport.frequency}
                onChange={(e) =>
                    setNewReport({ ...newReport, frequency: e.target.value })
                }
                className="w-full px-3 py-2 border rounded"
                >
                <option value="daily">روزانه</option>
                <option value="weekly">هفتگی</option>
                <option value="monthly">ماهانه</option>
                </select>
            </div>

            <div>
                <label className="block mb-2 text-gray-700">فرمت</label>
                <select
                value={newReport.format}
                onChange={(e) =>
                    setNewReport({ ...newReport, format: e.target.value })
                }
                className="w-full px-3 py-2 border rounded"
                >
                <option value="pdf">PDF</option>
                <option value="excel">Excel</option>
                </select>
            </div>

            <div>
                <label className="block mb-2 text-gray-700">زمان ارسال</label>
                <input
                type="time"
                value={newReport.startTime}
                onChange={(e) =>
                    setNewReport({ ...newReport, startTime: e.target.value })
                }
                className="w-full px-3 py-2 border rounded"
                />
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
                onClick={handleAddReport}
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

function getFrequencyLabel(freq) {
const labels = {
    daily: "روزانه",
    weekly: "هفتگی",
    monthly: "ماهانه",
};
return labels[freq] || freq;
}