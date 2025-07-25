import React, { useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { generateDataEntryTemplate } from "../utils/generateDataEntryTemplate";
import { exportComparisonToPDF } from "../utils/exportComparisonToPDF";

export default function DataUploadPage() {
const [showCompareModal, setShowCompareModal] = useState(false);
const [versionsToCompare, setVersionsToCompare] = useState({ left: null, right: null });
    const [originalWorkbook, setOriginalWorkbook] = useState(null); // نسخه اصلی فایل
const [repairPreview, setRepairPreview] = useState(null);
const [showRepairModal, setShowRepairModal] = useState(false);
const [showUndoModal, setShowUndoModal] = useState(false); // مدال بازگشت
const [file, setFile] = useState(null);
const [uploading, setUploading] = useState(false);
const [result, setResult] = useState(null);
const [progress, setProgress] = useState(0);
const [versionHistory, setVersionHistory] = useState([]);
const [previewData, setPreviewData] = useState(null); // داده‌های پیش‌نمایش
const [previewError, setPreviewError] = useState(null); // خطا در خواندن فایل

const openCompareModal = (versionA, versionB) => {
setVersionsToCompare({
    left: versionA,
    right: versionB || versionHistory.find(v => v.type === "original"),
});
setShowCompareModal(true);
};

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

const downloadOriginalFile = () => {
if (!originalWorkbook) return;

const originalFile = XLSX.write(originalWorkbook, {
    bookType: "xlsx",
    type: "array",
});

const blob = new Blob([originalFile], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
});

const url = URL.createObjectURL(blob);
const a = document.createElement("a");
a.href = url;
a.download = `اصلي_${file.name}`;
a.click();
URL.revokeObjectURL(url);

  // بستن مدال و پاک کردن وضعیت
setShowUndoModal(false);
setRepairPreview(null);
setOriginalWorkbook(null);
setPreviewData(null);
setPreviewError(null);
setFile(null);
};

const handleAutoRepair = async () => {
if (!file) return;

const reader = new FileReader();
reader.onload = async (e) => {
    try {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: "array" });

    const { workbook: repairedWorkbook, repaired, messages } = autoRepairWorkbook(workbook);

    if (!repaired) {
        setPreviewError("هیچ مشکلی برای تعمیر یافت نشد.");
        return;
    }

      // ✅ افزودن نسخه تعمیر شده به تاریخچه
    setVersionHistory(prev => [...prev, {
        id: Date.now(),
        type: "repaired",
        timestamp: new Date(),
        workbook: repairedWorkbook,
        message: "نسخه تعمیر شده تولید شد",
        changes: messages,
        filename: `تعمیر_شده_${file.name}`
    }]);

      // ادامه پیش‌نمایش تغییرات...
    const repairedWorksheet = repairedWorkbook.Sheets["ورود داده"];
    const repairedData = XLSX.utils.sheet_to_json(repairedWorksheet, { header: 1 });
    const repairedHeaders = repairedData[0];
    const repairedRows = repairedData.slice(1, 6);

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
    const reader = new FileReader();
    reader.onload = (e) => {
    try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });

        // افزودن به تاریخچه
        setVersionHistory([{
        id: Date.now(),
        type: "original",
        timestamp: new Date(),
        workbook,
        message: "فایل اصلی آپلود شد",
        filename: selectedFile.name
        }]);

        setFile(selectedFile);
        loadFilePreview(workbook); // نمایش پیش‌نمایش
        setResult(null);
        setProgress(0);
        setPreviewError(null);
    } catch (err) {
        setPreviewError("خطا در خواندن فایل.");
    }
    };
    reader.readAsArrayBuffer(selectedFile);
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

<button
onClick={() => {
    setShowRepairModal(false);
    setShowUndoModal(true);
}}
className="mb-6 text-sm text-red-500 hover:underline"
>
🔄 بازگشت به فایل اصلی
</button>

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

    {/* مدال مقایسه کنار به کنار */}
{showCompareModal && versionsToCompare.left && (
<>
    {/* --- مدال نمایش --- */}
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 no-print">
    <div className="w-full max-w-6xl p-6 overflow-y-auto bg-white rounded shadow-lg max-h-96">
        <h3 className="mb-6 text-xl font-semibold">مقایسه نسخه‌ها</h3>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <VersionPreviewCard version={versionsToCompare.left} />
        <VersionPreviewCard version={versionsToCompare.right} />
        </div>

        <div className="flex justify-between mt-6">
        <button
            onClick={() => setShowCompareModal(false)}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
        >
            بستن
        </button>
        <button
            onClick={() => window.print()}
            className="px-6 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
        >
            🖨️ چاپ مقایسه
        </button>
        </div>
    </div>
    </div>

    {/* --- نسخه قابل چاپ (مخفی) --- */}
    <div className="print-section" style={{ display: "none" }}>
    <PrintableComparisonContent 
        versionA={versionsToCompare.left} 
        versionB={versionsToCompare.right} 
    />
    </div>
</>
)}

{/* مدال تأیید بازگشت به حالت اصلی */}
{showUndoModal && (
<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div className="w-full max-w-md p-6 bg-white rounded shadow-lg">
    <h3 className="mb-4 text-xl font-semibold">بازگشت به فایل اصلی</h3>
    <p className="mb-6 text-gray-700">
        آیا مطمئن هستید؟ تمام تغییرات تعمیر لغو می‌شوند و به فایل اصلی باز می‌گردید.
    </p>
    <div className="flex justify-end space-x-4 space-x-reverse">
        <button
        onClick={() => setShowUndoModal(false)}
        className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
        >
        انصراف
        </button>
        <button
        onClick={downloadOriginalFile}
        className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
        >
        بله، بازگردانی
        </button>
    </div>
    </div>
</div>
)}

{/* تاریخچه نسخه‌ها */}
{versionHistory.length > 0 && (
<div className="p-6 mb-8 bg-white rounded shadow">
    <h3 className="mb-4 text-xl font-semibold">تاریخچه نسخه‌ها</h3>
    <div className="space-y-3">
    {versionHistory.map((version) => (
        <div
        key={version.id}
        className={`p-4 rounded border ${
            version.type === "original"
            ? "bg-blue-50 border-blue-200"
            : "bg-green-50 border-green-200"
        }`}
        >
        <div className="flex items-start justify-between">
            <div>
            <span
                className={`inline-block px-2 py-1 text-xs font-semibold rounded mr-2 ${
                version.type === "original"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-green-100 text-green-800"
                }`}
            >
                {version.type === "original" ? "اصلی" : "تعمیر شده"}
            </span>
            <strong>{version.filename}</strong>
            </div>
            <span className="text-xs text-gray-500">
            {new Date(version.timestamp).toLocaleTimeString("fa-IR")}
            </span>

<button
onClick={() => openCompareModal(version)}
className="mr-2 text-sm text-blue-500 hover:underline"
>
مقایسه
</button>
            
        </div>

        <p className="mt-2 text-sm text-gray-700">{version.message}</p>

          {/* تغییرات (فقط برای نسخه تعمیر شده) */}
        {version.changes && (
            <ul className="pt-2 mt-2 space-y-1 text-xs text-gray-600 border-t">
            {version.changes.map((change, i) => (
                <li key={i}>• {change}</li>
            ))}
            </ul>
        )}

<button
onClick={() => openCompareModal(version)}
className="mr-2 text-sm text-blue-500 hover:underline"
>
مقایسه
</button>

          {/* دکمه دانلود */}
        <button
            onClick={() => downloadVersion(version)}
            className="px-3 py-1 mt-3 text-sm bg-gray-200 rounded hover:bg-gray-300"
        >
            📥 دانلود نسخه
        </button>
        </div>
    ))}
    </div>
</div>
)}

{/* مدال مقایسه نسخه‌ها */}
{showCompareModal && versionsToCompare.left && (
<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
    <div className="w-full max-w-6xl p-6 overflow-y-auto bg-white rounded shadow-lg max-h-96">
    <h3 className="mb-6 text-xl font-semibold">مقایسه نسخه‌ها</h3>

    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* نسخه چپ */}
        <div>
        <div className="flex items-center justify-between mb-3">
            <span
            className={`inline-block px-2 py-1 text-xs font-semibold rounded ${
                versionsToCompare.left.type === "original"
                ? "bg-blue-100 text-blue-800"
                : "bg-green-100 text-green-800"
            }`}
            >
            {versionsToCompare.left.type === "original" ? "اصلی" : "تعمیر شده"}
            </span>
            <span className="text-xs text-gray-500">
            {new Date(versionsToCompare.left.timestamp).toLocaleString("fa-IR")}
            </span>
            
        </div>

        <VersionPreview workbook={versionsToCompare.left.workbook} />
        </div>

        {/* نسخه راست */}
        <div>
        <div className="flex items-center justify-between mb-3">
            <span
            className={`inline-block px-2 py-1 text-xs font-semibold rounded ${
                versionsToCompare.right.type === "original"
                ? "bg-blue-100 text-blue-800"
                : "bg-green-100 text-green-800"
            }`}
            >
            {versionsToCompare.right.type === "original" ? "اصلی" : "تعمیر شده"}
            </span>
            <span className="text-xs text-gray-500">
            {new Date(versionsToCompare.right.timestamp).toLocaleString("fa-IR")}
            </span>
        </div>

        <VersionPreview workbook={versionsToCompare.right.workbook} />
        </div>

{/* دکمه خروجی PDF */}
<button
onClick={() => exportComparisonToPDF(versionsToCompare.left, versionsToCompare.right)}
className="px-4 py-2 mt-6 text-white bg-red-500 rounded hover:bg-red-600"
>
📄 خروجی PDF مقایسه
</button>
        
    </div>

      {/* دکمه بستن */}
    <div className="flex justify-end mt-6">
        <button
        onClick={() => setShowCompareModal(false)}
        className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
        >
        بستن
        </button>
    </div>
    </div>
</div>
)}
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

// تابع تعمیر خودکار فایل اکسل
function autoRepairWorkbook(workbook) {
let repaired = false;
const messages = [];
let jsonData = null;

  // کپی از workbook برای تغییرات
const repairedWorkbook = XLSX.utils.book_new();
const sheetNames = workbook.SheetNames;

  // فقط برگه "ورود داده" را بررسی و تعمیر کن
const sheetName = sheetNames.find((name) => name === "ورود داده");
if (!sheetName) {
    messages.push('برگه "ورود داده" پیدا نشد و اضافه شد.');
    // ایجاد برگه جدید با هدرهای پیش‌فرض
    const headers = [
    "عنوان گزارش",
    "نام گزارش",
    "فرمت",
    "تگ‌ها (با کاما جدا کنید)",
    "تاریخ ایجاد (سال/ماه/روز)",
    ];
    const ws = XLSX.utils.aoa_to_sheet([headers]);
    XLSX.utils.book_append_sheet(repairedWorkbook, ws, "ورود داده");
    repaired = true;
} else {
    // برگه موجود را بررسی و تعمیر کن
    const ws = workbook.Sheets[sheetName];
    jsonData = XLSX.utils.sheet_to_json(ws, { header: 1 });

    // هدرها
    const headers = jsonData[0] || [];
    const requiredColumns = [
    "عنوان گزارش",
    "نام گزارش",
    "فرمت",
    "تگ‌ها (با کاما جدا کنید)",
    "تاریخ ایجاد (سال/ماه/روز)",
    ];

    // اضافه کردن ستون‌های جاافتاده
    let fixedHeaders = [...headers];
    let changed = false;
    requiredColumns.forEach((col) => {
    if (!fixedHeaders.includes(col)) {
        fixedHeaders.push(col);
        messages.push(`ستون "${col}" اضافه شد.`);
        changed = true;
    }
    });

    // اگر هدرها تغییر کرد، داده‌ها را با هدر جدید بازسازی کن
    let fixedRows = jsonData.slice(1).map((row) => {
    const newRow = [];
    fixedHeaders.forEach((col, idx) => {
        const oldIdx = headers.indexOf(col);
        newRow[idx] = oldIdx !== -1 ? row[oldIdx] : "";
    });
    return newRow;
    });

    // اگر هیچ داده‌ای نبود، یک ردیف خالی اضافه کن
    if (fixedRows.length === 0) {
    fixedRows.push(Array(fixedHeaders.length).fill(""));
    messages.push("یک ردیف خالی اضافه شد.");
    changed = true;
    }

    // بازسازی برگه
    const newSheet = XLSX.utils.aoa_to_sheet([fixedHeaders, ...fixedRows]);
    XLSX.utils.book_append_sheet(repairedWorkbook, newSheet, "ورود داده");

    if (changed) repaired = true;
}

return {
    workbook: repairedWorkbook,
    repaired,
    messages,
    jsonData,
};
}

const downloadVersion = (version) => {
const file = XLSX.write(version.workbook, {
    bookType: "xlsx",
    type: "array",
});

const blob = new Blob([file], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
});

const url = URL.createObjectURL(blob);
const a = document.createElement("a");
a.href = url;
a.download = version.filename;
a.click();
URL.revokeObjectURL(url);
};

function VersionPreview({ workbook }) {
const worksheet = workbook.Sheets["ورود داده"];
if (!worksheet) return <p className="text-red-500">برگه پیدا نشد.</p>;

const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
if (data.length < 2) return <p className="text-gray-500">داده‌ای وجود ندارد.</p>;

const headers = data[0];
  const rows = data.slice(1, 6); // 5 ردیف اول

return (
    <div className="overflow-x-auto border rounded">
    <table className="min-w-full text-sm">
        <thead className="bg-gray-100">
    <tr>
            {headers.map((header, i) => (
            <th key={i} className="px-3 py-2 text-xs font-semibold text-right border-b">
                {header}
            </th>
            ))}
        </tr>
        </thead>
        <tbody>
        {rows.map((row, i) => (
            <tr key={i} className="hover:bg-gray-50">
            {headers.map((_, j) => (
                <td key={j} className="px-3 py-2 text-right border-b">
                {row[j] !== undefined ? String(row[j]) : "-"}
                </td>
            ))}
            </tr>
        ))}
        </tbody>
    </table>
    </div>
);
}

function PrintableComparisonContent({ versionA, versionB }) {
const dataA = extractSheetData(versionA.workbook);
const dataB = extractSheetData(versionB.workbook);

return (
    <div style={{ padding: "20mm", fontFamily: "Tahoma, sans-serif", direction: "rtl" }}>
    <h1 style={{ textAlign: "center", fontSize: "24pt", marginBottom: "20px" }}>
        گزارش مقایسه نسخه‌های فایل اکسل
    </h1>
    <p style={{ textAlign: "center", fontSize: "14pt", color: "#555", marginBottom: "30px" }}>
        تاریخ: {new Date().toLocaleDateString("fa-IR")}
    </p>

    <div style={{ display: "flex", gap: "20px", marginTop: "30px" }}>
        {/* نسخه چپ */}
        <div style={{ flex: 1 }}>
        <h2 style={{
            backgroundColor: "#4F81BD",
            color: "white",
            padding: "10px",
            borderRadius: "4px",
            textAlign: "center",
            fontSize: "16pt"
        }}>
            {versionA.type === "original" ? "نسخه اصلی" : "نسخه تعمیر شده"}
        </h2>
        <div style={{ marginTop: "10px", fontSize: "12pt" }}>
            <p><strong>فایل:</strong> {versionA.filename}</p>
            <p><strong>زمان:</strong> {new Date(versionA.timestamp).toLocaleString("fa-IR")}</p>
        </div>

        {dataA && (
            <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "15px", fontSize: "10pt" }}>
            <thead>
                <tr style={{ backgroundColor: "#4F81BD", color: "white" }}>
                {dataA.headers.map((h, i) => (
                    <th key={i} style={{ border: "1px solid #ddd", padding: "8px", textAlign: "right" }}>
                    {h}
                    </th>
                ))}
                </tr>
        </thead>
        <tbody>
                {dataA.rows.map((row, i) => (
                <tr key={i} style={{ backgroundColor: i % 2 === 0 ? "#f9f9f9" : "white" }}>
                    {dataA.headers.map((_, j) => (
                    <td key={j} style={{ border: "1px solid #ddd", padding: "6px", textAlign: "right" }}>
                        {row[j] !== undefined ? String(row[j]) : "-"}
                    </td>
                    ))}
                </tr>
                ))}
            </tbody>
            </table>
        )}
        </div>

        {/* نسخه راست */}
        <div style={{ flex: 1 }}>
        <h2 style={{
            backgroundColor: "#4F81BD",
            color: "white",
            padding: "10px",
            borderRadius: "4px",
            textAlign: "center",
            fontSize: "16pt"
        }}>
            {versionB.type === "original" ? "نسخه اصلی" : "نسخه تعمیر شده"}
        </h2>
        <div style={{ marginTop: "10px", fontSize: "12pt" }}>
            <p><strong>فایل:</strong> {versionB.filename}</p>
            <p><strong>زمان:</strong> {new Date(versionB.timestamp).toLocaleString("fa-IR")}</p>
        </div>

        {dataB && (
            <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "15px", fontSize: "10pt" }}>
            <thead>
                <tr style={{ backgroundColor: "#4F81BD", color: "white" }}>
                {dataB.headers.map((h, i) => (
                    <th key={i} style={{ border: "1px solid #ddd", padding: "8px", textAlign: "right" }}>
                    {h}
                    </th>
                ))}
                </tr>
            </thead>
            <tbody>
                {dataB.rows.map((row, i) => (
                <tr key={i} style={{ backgroundColor: i % 2 === 0 ? "#f9f9f9" : "white" }}>
                    {dataB.headers.map((_, j) => (
                    <td key={j} style={{ border: "1px solid #ddd", padding: "6px", textAlign: "right" }}>
                        {row[j] !== undefined ? String(row[j]) : "-"}
                    </td>
                    ))}
                </tr>
                ))}
            </tbody>
            </table>
        )}
        </div>
    </div>

      {/* تغییرات */}
    {versionB.changes && (
        <div style={{ marginTop: "30px", fontSize: "12pt" }}>
        <h3 style={{ borderBottom: "2px solid #4F81BD", paddingBottom: "5px", marginBottom: "10px" }}>
            تغییرات اعمال شده:
        </h3>
        <ul style={{ dir: "rtl", textAlign: "right", marginRight: "20px" }}>
            {versionB.changes.map((change, i) => (
            <li key={i} style={{ marginBottom: "5px" }}>{change}</li>
            ))}
        </ul>
        </div>
    )}

    <div style={{ marginTop: "40px", textAlign: "center", fontSize: "10pt", color: "#777" }}>
        تولید شده توسط سیستم مدیریت گزارش
    </div>
    </div>
);
}


function extractSheetData(workbook) {
const worksheet = workbook.Sheets["ورود داده"];
if (!worksheet) return null;

const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
if (jsonData.length < 2) return null;

return {
    headers: jsonData[0],
    rows: jsonData.slice(1, 6),
};
}

function VersionPreviewCard({ version }) {
if (!version || !version.workbook) {
    return (
    <div className="p-4 text-gray-500 border rounded bg-gray-50">
        نسخه‌ای برای نمایش وجود ندارد.
    </div>
    );
}

const worksheet = version.workbook.Sheets["ورود داده"];
if (!worksheet) {
    return (
    <div className="p-4 text-red-600 border rounded bg-red-50">
        برگه "ورود داده" پیدا نشد.
    </div>
    );
}

const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
if (data.length < 2) {
    return (
    <div className="p-4 text-gray-500 border rounded bg-gray-50">
        داده‌ای وجود ندارد.
    </div>
    );
}

const headers = data[0];
  const rows = data.slice(1, 6); // فقط ۵ ردیف اول

return (
    <div className="overflow-x-auto border rounded">
    <div className="flex items-center justify-between mb-2">
        <span
        className={`inline-block px-2 py-1 text-xs font-semibold rounded ${
            version.type === "original"
            ? "bg-blue-100 text-blue-800"
            : "bg-green-100 text-green-800"
        }`}
        >
        {version.type === "original" ? "اصلی" : "تعمیر شده"}
        </span>
        <span className="text-xs text-gray-500">{version.filename}</span>
    </div>
    <table className="min-w-full text-sm">
        <thead className="bg-gray-100">
        <tr>
            {headers.map((header, i) => (
            <th key={i} className="px-3 py-2 text-xs font-semibold text-right border-b">
                {header}
            </th>
            ))}
        </tr>
        </thead>
        <tbody>
        {rows.map((row, i) => (
            <tr key={i} className="hover:bg-gray-50">
            {headers.map((_, j) => (
                <td key={j} className="px-3 py-2 text-right border-b">
                {row[j] !== undefined ? String(row[j]) : "-"}
                </td>
            ))}
            </tr>
        ))}
        </tbody>
    </table>
    {version.changes && version.changes.length > 0 && (
        <ul className="pt-2 mt-2 space-y-1 text-xs text-gray-600 border-t">
        {version.changes.map((change, i) => (
            <li key={i}>• {change}</li>
        ))}
        </ul>
    )}
    </div>
    )}