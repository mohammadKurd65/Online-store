import jsPDF from "jspdf";
import "jspdf-autotable";

// فونت فارسی (برای پشتیبانی از متن فارسی)
import VazirFont from "./Vazir-Regular-normal"; // فونت رو بعداً توضیح می‌دم

export function exportToPDF(data, summaryStats) {
const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
});

  // ✅ استفاده از فونت فارسی
doc.addFileToVFS("Vazir.ttf", VazirFont);
doc.addFont("Vazir.ttf", "Vazir", "normal");
doc.setFont("Vazir");

  // عنوان گزارش
doc.setFontSize(18);
doc.text("گزارش لاگ‌های اعلان دائمی", 140, 20, { align: "center" });

  // زیرعنوان: تاریخ
doc.setFontSize(12);
doc.text(`تاریخ: ${new Date().toLocaleDateString("fa-IR")}`, 140, 30, { align: "center" });

  // خلاصه آماری
doc.setFontSize(14);
doc.text("خلاصه آماری", 20, 50);

const summaryData = [
    ["تعداد کل لاگ‌ها", summaryStats.total],
    ["ایجاد شده", summaryStats.creates],
    ["ویرایش شده", summaryStats.updates],
    ["حذف شده", summaryStats.deletes],
    ["تعداد ادمین‌های فعال", summaryStats.uniqueAdmins],
    ["آخرین عملیات", summaryStats.lastAction],
];

doc.autoTable({
    startY: 55,
    head: [["متر", "مقدار"]],
    body: summaryData,
    theme: "striped",
    headStyles: { fillColor: [79, 129, 189], textColor: [255, 255, 255], font: "Vazir" },
    columnStyles: {
    0: { cellWidth: 60, halign: "right" },
    1: { cellWidth: 40, halign: "right" },
    },
    styles: { font: "Vazir", halign: "right", rtl: true },
});

  // جدول لاگ‌ها (اولین ۲۰ تا)
const recentLogs = data.slice(0, 20).map((log) => [
    getActionLabel(log.action),
    log.admin?.username || "ناشناس",
    log.description || "-",
    new Date(log.createdAt).toLocaleString("fa-IR"),
]);

doc.setFontSize(14);
doc.text("آخرین لاگ‌ها (20 مورد)", 20, doc.lastAutoTable.finalY + 15);

doc.autoTable({
    startY: doc.lastAutoTable.finalY + 20,
    head: [["عملیات", "ادمین", "شرح", "زمان"]],
    body: recentLogs,
    theme: "striped",
    headStyles: { fillColor: [79, 129, 189], font: "Vazir" },
    styles: { font: "Vazir", halign: "right", rtl: true },
    columnStyles: {
    0: { cellWidth: 30 },
    1: { cellWidth: 30 },
    2: { cellWidth: 50 },
    3: { cellWidth: 40 },
    },
});

  // پاورقی
const finalY = doc.lastAutoTable.finalY;
if (finalY < 270) {
    doc.setFontSize(10);
    doc.text("تولید شده توسط سیستم مدیریت اعلان", 20, finalY + 15);
}

  // دانلود فایل
doc.save("گزارش_لاگ_اعلان_دائمی.pdf");
}

// تابع ترجمه عملیات
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