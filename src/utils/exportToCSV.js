import { unparse } from "papaparse";

export function exportToCSV(data, filename = "logs.csv") {
  // تبدیل داده‌ها به فرمت مناسب CSV
const csvData = data.map((log) => ({
    عملیات: getActionLabel(log.action),
    ادمین: log.admin?.username || "ناشناس",
    شرح: log.description || "-",
    زمان: new Date(log.createdAt).toLocaleString("fa-IR"),
    IP: log.ip,
    مرورگر: log.userAgent,
    نوع_اعلان: log.newData?.type || log.previousData?.type || "-",
    عنوان_اعلان: log.newData?.title || log.previousData?.title || "-",
}));

  // استفاده از papaparse برای تولید CSV
const csv = unparse(csvData);

  // ایجاد لینک و دانلود
const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
const link = document.createElement("a");
const url = URL.createObjectURL(blob);
link.setAttribute("href", url);
link.setAttribute("download", filename);
link.style.visibility = "hidden";
document.body.appendChild(link);
link.click();
document.body.removeChild(link);
}

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