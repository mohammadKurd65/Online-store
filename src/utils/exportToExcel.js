import * as XLSX from "xlsx";

export function exportToExcel(data, filename = "لاگ_اعلان_دائمی.xlsx") {
  // آماده‌سازی داده‌ها برای اکسل
const worksheetData = data.map((log) => ({
    "عملیات": getActionLabel(log.action),
    "ادمین": log.admin?.username || "ناشناس",
    "شرح": log.description || "-",
    "زمان": new Date(log.createdAt).toLocaleString("fa-IR"),
    "IP آدرس": log.ip,
    "مرورگر": log.userAgent,
    "عنوان اعلان": log.newData?.title || log.previousData?.title || "-",
    "نوع اعلان": log.newData?.type || log.previousData?.type || "-",
    "وضعیت": log.newData?.active !== undefined 
    ? (log.newData.active ? "فعال" : "غیرفعال") 
    : "-",
}));

  // ساخت شیت اکسل
const worksheet = XLSX.utils.json_to_sheet(worksheetData);

  // تنظیم عرض ستون‌ها
worksheet["!cols"] = [
    { wch: 15 }, // عملیات
    { wch: 15 }, // ادمین
    { wch: 20 }, // شرح
    { wch: 20 }, // زمان
    { wch: 15 }, // IP
    { wch: 25 }, // مرورگر
    { wch: 25 }, // عنوان اعلان
    { wch: 15 }, // نوع اعلان
    { wch: 15 }, // وضعیت
];

  // ساخت کاربرگ (workbook)
const workbook = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(workbook, worksheet, "لاگ‌های اعلان");

  // خروجی و دانلود
XLSX.writeFile(workbook, filename, { 
    bookType: "xlsx", 
    type: "binary",
    compression: true // فشرده‌سازی
});
}

// تابع ترجمه نوع عملیات
function getActionLabel(action) {
const labels = {
    create: "ایجاد",
    update: "ویرایش",
    delete: "حذف",
    activate: "فعال‌سازی",
    deactivate: "غیرفعال‌سازی",
};
return labels[action] || action;
}