import React, { useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { generateDataEntryTemplate } from "../utils/generateDataEntryTemplate";

export default function DataUploadPage() {
const [repairPreview, setRepairPreview] = useState(null);
const [showRepairModal, setShowRepairModal] = useState(false);
const [file, setFile] = useState(null);
const [uploading, setUploading] = useState(false);
const [result, setResult] = useState(null);
const [progress, setProgress] = useState(0);
  const [previewData, setPreviewData] = useState(null); // داده‌های پیش‌نمایش
  const [previewError, setPreviewError] = useState(null); // خطا در خواندن فایل

const downloadRepairedFile = () => {
const { repairedWorkbook } = repairPreview;

const repairedFile = XLSX.write(repairedWorkbook, { 
    bookType: "xlsx", 
    type: "array" 
});

const blob = new Blob([repairedFile], { 
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" 
});

const url = URL.createObjectURL(blob);
const a = document.createElement("a");
a.href = url;
a.download = `تعمیر_شده_${repairPreview.originalFile.name}`;
a.click();
URL.revokeObjectURL(url);

setShowRepairModal(false);
setPreviewError(null);
  setFile(null); // اختیاری: پاک کردن فایل قدیمی
};

const loadFilePreview = (file) => {
setFile(file);
setResult(null);
setProgress(0);
setPreviewError(null);
setPreviewData(null);

const reader = new FileReader();
reader.onload = (e) => {
    try {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: "array" });

      // ✅ 1. بررسی وجود برگه "ورود داده"
    const worksheet = workbook.Sheets["ورود داده"];
    if (!worksheet) {
        setPreviewError(
        'برگه‌ای با نام "ورود داده" پیدا نشد. لطفاً از قالب دانلودی استفاده کنید.'
        );
        return;
    }

    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    if (jsonData.length < 2) {
        setPreviewError("فایل خالی است. حداقل یک ردیف داده وارد کنید.");
        return;
    }

    const headers = jsonData[0];
    const requiredColumns = [
        "عنوان گزارش",
        "نام گزارش",
        "فرمت",
        "تگ‌ها (با کاما جدا کنید)",
        "تاریخ ایجاد (سال/ماه/روز)",
    ];

      // ✅ 2. بررسی ستون‌های ضروری
    const missingColumns = requiredColumns.filter(col => !headers.includes(col));
    if (missingColumns.length > 0) {
        setPreviewError(
        `ستون‌های زیر یافت نشدند: ${missingColumns.join(", ")}\nلطفاً از قالب اصلی استفاده کنید.`
        );
        return;
    }

      // ✅ 3. پیش‌نمایش داده‌ها (5 ردیف اول)
    const rows = jsonData.slice(1, 6);
    setPreviewData({ headers, rows });

    } catch (err) {
    setPreviewError("خطا در خواندن فایل اکسل. فایل ممکن است خراب باشد.");
    console.error(err);
    }
};
reader.onerror = () => {
    setPreviewError("خطا در خواندن فایل.");
};
reader.readAsArrayBuffer(file);
};


const handleAutoRepair = async () => {
if (!file) return;

const reader = new FileReader();
reader.onload = async (e) => {
    try {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: "array" });

    const { workbook: repairedWorkbook, repaired, messages, jsonData } = autoRepairWorkbook(workbook);

    if (!repaired) {
        setPreviewError("هیچ مشکلی برای تعمیر یافت نشد.");
        return;
    }

      // استخراج داده‌های تعمیر شده برای پیش‌نمایش
    const repairedWorksheet = repairedWorkbook.Sheets["ورود داده"];
    const repairedData = XLSX.utils.sheet_to_json(repairedWorksheet, { header: 1 });
    const repairedHeaders = repairedData[0];
      const repairedRows = repairedData.slice(1, 6); // 5 ردیف اول

      // ذخیره پیش‌نمایش تغییرات
    setRepairPreview({
        messages,
        headers: repairedHeaders,
        rows: repairedRows,
        originalFile: file,
        repairedWorkbook,
    });

    setShowRepairModal(true);

    } catch (err) {
    setPreviewError("خطا در تحلیل فایل برای تعمیر.");
    console.error(err);
    }
};
reader.readAsArrayBuffer(file);
};

const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
    loadFilePreview(selectedFile);
    }
};

const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const files = Array.from(e.dataTransfer.files);
    const excelFile = files.find(file =>
    file.name.endsWith(".xlsx") || file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    if (excelFile) {
    loadFilePreview(excelFile);
    } else {
    setPreviewError("لطفاً فقط فایل اکسل (.xlsx) بکشید.");
    }
};


const handleUpload = async () => {
    if (!file) {
    alert("لطفاً یک فایل انتخاب کنید.");
    return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setUploading(true);
    setProgress(0);
    setResult(null);

    try {
    const token = localStorage.getItem("adminToken");

    const res = await axios.post(
        "http://localhost:5000/api/admin/reports/upload-template",
        formData,
        {
        headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
        },
        onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setProgress(percentCompleted);
        },
        }
    );

    setResult({
        success: true,
        message: res.data.message,
        imported: res.data.imported,
        errors: null,
    });
    } catch (err) {
    const errorMessage = err.response?.data?.message || "خطای ناشناخته";
    const errors = err.response?.data?.errors || [];

    setResult({
        success: false,
        message: errorMessage,
        errors,
    });
    } finally {
    setUploading(false);
    }
};

return (
    <div className="container py-10 mx-auto">
    <h2 className="mb-6 text-3xl font-bold">آپلود داده گزارش</h2>

      {/* دانلود قالب */}
    <div className="p-6 mb-8 bg-white rounded shadow">
        <h3 className="mb-4 text-xl font-semibold">۱. دانلود قالب ورود داده</h3>
        <p className="mb-4 text-gray-700">
        ابتدا قالب زیر رو دانلود کن، داده‌ها رو وارد کن و دوباره آپلود کن.
        </p>
        <button
        onClick={generateDataEntryTemplate}
        className="flex items-center px-6 py-3 space-x-2 space-x-reverse text-white bg-blue-500 rounded hover:bg-blue-600"
        >
        <span>📥 دانلود قالب اکسل</span>
        </button>
    </div>

      {/* آپلود و پیش‌نمایش */}
    <div className="p-6 mb-8 bg-white rounded shadow">
        <h3 className="mb-4 text-xl font-semibold">۲. آپلود فایل پر شده</h3>

        {/* منطقه دراگ و دراپ */}
        <div
        onDragOver={(e) => {
            e.preventDefault();
            e.stopPropagation();
        }}
        onDragEnter={(e) => {
            e.preventDefault();
            e.stopPropagation();
        }}
        onDragLeave={(e) => {
            e.preventDefault();
            e.stopPropagation();
        }}
        onDrop={handleDrop}
        className="p-8 mb-6 text-center transition-colors duration-200 border-2 border-dashed rounded-lg cursor-pointer hover:border-blue-400"
        >
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-12 h-12 mx-auto text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
        >
            <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
    </svg>
        <p className="mt-2 text-gray-600">
            <strong>فایل رو اینجا بکشید و رها کنید</strong>
        </p>
        <p className="text-sm text-gray-500">یا برای انتخاب کلیک کنید</p>
        <input
            type="file"
            accept=".xlsx"
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        </div>

        {/* خطا در پیش‌نمایش */}
{/* پیشنهاد تعمیر خودکار */}
{previewError && (
<div className="p-4 mb-6 border border-yellow-200 rounded bg-yellow-50">
    <div className="flex items-start">
    <svg className="h-5 w-5 text-yellow-500 mt-0.5 ml-2" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.487 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
    </svg>
    <div>
        <p className="mb-2 text-yellow-800">{previewError}</p>
        <button
        onClick={handleAutoRepair}
        className="px-3 py-1 text-sm text-white bg-yellow-600 rounded hover:bg-yellow-700"
        >
        🛠️ تعمیر خودکار فایل
        </button>
    </div>
    </div>
</div>
)}
        {/* پیش‌نمایش داده */}
        {previewData && !previewError && (
        <div className="mb-6">
            <h4 className="mb-3 font-semibold">پیش‌نمایش داده‌ها (5 ردیف اول)</h4>
            <div className="overflow-x-auto">
            <table className="min-w-full border rounded">
                <thead className="bg-gray-100">
                <tr>
                    {previewData.headers.map((header, i) => (
                    <th key={i} className="px-4 py-2 text-right border-b">
                        {header}
                    </th>
                    ))}
                </tr>
                </thead>
                <tbody>
                {previewData.rows.length === 0 ? (
                    <tr>
                    <td colSpan={previewData.headers.length} className="py-4 text-center text-gray-500">
                        داده‌ای یافت نشد.
                    </td>
                    </tr>
                ) : (
                    previewData.rows.map((row, i) => (
                    <tr key={i} className="hover:bg-gray-50">
                        {previewData.headers.map((_, j) => (
                        <td key={j} className="px-4 py-2 text-right border-b">
                            {row[j] !== undefined ? String(row[j]) : "-"}
                        </td>
                        ))}
                    </tr>
                    ))
                )}
                </tbody>
            </table>
            </div>
        </div>
        )}

        {/* نمایش فایل انتخاب شده */}
        {file && !previewError && (
        <div className="flex items-center justify-between p-3 mt-4 border border-blue-200 rounded bg-blue-50">
            <span className="text-sm">{file.name}</span>
            <button
            onClick={() => {
                setFile(null);
                setPreviewData(null);
                setPreviewError(null);
            }}
            className="text-sm text-red-500 hover:text-red-700"
            >
            حذف
            </button>
        </div>
        )}

        {/* نوار پیشرفت */}
        {uploading && (
        <div className="mt-6 mb-4">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
                className="bg-blue-500 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
            ></div>
            </div>
            <p className="mt-1 text-sm text-gray-600">{progress}% آپلود شده</p>
        </div>
        )}

        {/* دکمه آپلود */}
        <button
        onClick={handleUpload}
        disabled={uploading || !file || !!previewError}
        className={`mt-6 px-6 py-3 rounded font-semibold text-white w-full ${
            uploading || !file || previewError
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-green-500 hover:bg-green-600"
        }`}
        >
        {uploading ? "در حال آپلود..." : "آپلود فایل"}
        </button>

        {/* مدال پیش‌نمایش تغییرات */}
{showRepairModal && repairPreview && (
<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div className="w-full max-w-4xl p-6 overflow-y-auto bg-white rounded shadow-lg max-h-96">
    <h3 className="mb-4 text-xl font-semibold">پیش‌نمایش تغییرات</h3>

      {/* لیست تغییرات */}
    <div className="mb-6">
        <h4 className="mb-2 font-semibold">تغییرات اعمال شده:</h4>
        <ul className="space-y-1 text-gray-700 list-disc list-inside">
        {repairPreview.messages.map((msg, i) => (
            <li key={i} className="text-sm">{msg}</li>
        ))}
        </ul>
    </div>

      {/* پیش‌نمایش داده تعمیر شده */}
    <div>
        <h4 className="mb-2 font-semibold">داده‌های تعمیر شده (5 ردیف اول)</h4>
        <div className="overflow-x-auto">
        <table className="min-w-full border rounded">
            <thead className="bg-gray-100">
            <tr>
                {repairPreview.headers.map((header, i) => (
                <th key={i} className="px-4 py-2 text-xs font-semibold text-right border-b">
                    {header}
                </th>
                ))}
            </tr>
            </thead>
            <tbody>
            {repairPreview.rows.length === 0 ? (
                <tr>
                <td colSpan={repairPreview.headers.length} className="py-4 text-center text-gray-500">
                    داده‌ای وجود ندارد.
                </td>
                </tr>
            ) : (
                repairPreview.rows.map((row, i) => (
                <tr key={i} className="hover:bg-gray-50">
                    {repairPreview.headers.map((_, j) => (
                    <td key={j} className="px-4 py-2 text-sm text-right border-b">
                        {row[j] !== undefined ? String(row[j]) : "-"}
                    </td>
                    ))}
                </tr>
                ))
            )}
            </tbody>
        </table>
        </div>
    </div>

      {/* دکمه‌ها */}
    <div className="flex justify-end mt-6 space-x-4 space-x-reverse">
        <button
        onClick={() => setShowRepairModal(false)}
        className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
        >
        انصراف
        </button>
        <button
        onClick={downloadRepairedFile}
        className="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600"
        >
        ✅ دانلود فایل تعمیر شده
        </button>
    </div>
    </div>
</div>
)}
        
    </div>

      {/* نتیجه */}
    {result && (
        <div
        className={`p-6 rounded shadow ${
            result.success
            ? "bg-green-50 border border-green-200"
            : "bg-red-50 border border-red-200"
        }`}
        >
        <h3 className="mb-2 text-lg font-semibold">
            {result.success ? "✅ آپلود موفقیت‌آمیز" : "❌ خطا در آپلود"}
        </h3>
        <p>{result.message}</p>

        {result.imported !== undefined && (
            <p className="mt-2">
            <strong>{result.imported}</strong> گزارش با موفقیت وارد شد.
            </p>
        )}

        {result.errors && result.errors.length > 0 && (
            <div className="mt-4">
            <h4 className="font-semibold text-red-800">خطاهای یافت شده:</h4>
            <ul className="mt-2 space-y-1 text-red-700 list-disc list-inside">
                {result.errors.map((error, i) => (
                <li key={i} className="text-sm">{error}</li>
                ))}
            </ul>
            </div>
        )}
        </div>
    )}
    </div>
);
}