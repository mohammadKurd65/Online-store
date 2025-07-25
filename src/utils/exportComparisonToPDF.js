import jsPDF from "jspdf";
import "jspdf-autotable";
import VazirFont from "./Vazir-Regular-normal"; // فونت فارسی

export function exportComparisonToPDF(versionA, versionB) {
const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
});

  // ✅ استفاده از فونت فارسی
doc.addFileToVFS("Vazir.ttf", VazirFont);
doc.addFont("Vazir.ttf", "Vazir", "normal");
doc.setFont("Vazir");

  // عنوان گزارش
doc.setFontSize(18);
doc.text("گزارش مقایسه نسخه‌های فایل اکسل", 148, 20, { align: "center" });

  // زیرعنوان: تاریخ
doc.setFontSize(12);
doc.text(`تاریخ: ${new Date().toLocaleDateString("fa-IR")}`, 148, 30, { align: "center" });

  // اطلاعات نسخه چپ
doc.setFontSize(14);
doc.text("نسخه چپ", 30, 50);
doc.setFontSize(12);
doc.text(`نوع: ${versionA.type === "original" ? "اصلی" : "تعمیر شده"}`, 30, 57);
doc.text(`زمان: ${new Date(versionA.timestamp).toLocaleString("fa-IR")}`, 30, 64);
doc.text(`فایل: ${versionA.filename}`, 30, 71);

  // اطلاعات نسخه راست
doc.setFontSize(14);
doc.text("نسخه راست", 150, 50);
doc.setFontSize(12);
doc.text(`نوع: ${versionB.type === "original" ? "اصلی" : "تعمیر شده"}`, 150, 57);
doc.text(`زمان: ${new Date(versionB.timestamp).toLocaleString("fa-IR")}`, 150, 64);
doc.text(`فایل: ${versionB.filename}`, 150, 71);

  // --- داده‌های نسخه چپ ---
const dataA = extractSheetData(versionA.workbook);
if (dataA) {
    doc.setFontSize(14);
    doc.text("داده‌های نسخه چپ", 30, 90);
    
    doc.autoTable({
    startY: 95,
    head: [dataA.headers],
    body: dataA.rows,
    theme: "striped",
    headStyles: { fillColor: [79, 129, 189], font: "Vazir" },
    columnStyles: getColumnStyles(dataA.headers.length),
    styles: { font: "Vazir", halign: "right", rtl: true },
    margin: { left: 30 },
    });
}

  // --- داده‌های نسخه راست ---
const dataB = extractSheetData(versionB.workbook);
if (dataB) {
    const finalY = doc.lastAutoTable.finalY;
    doc.setFontSize(14);
    doc.text("داده‌های نسخه راست", 150, finalY + 10);
    
    doc.autoTable({
    startY: finalY + 15,
    head: [dataB.headers],
    body: dataB.rows,
    theme: "striped",
    headStyles: { fillColor: [79, 129, 189], font: "Vazir" },
    columnStyles: getColumnStyles(dataB.headers.length),
    styles: { font: "Vazir", halign: "right", rtl: true },
    margin: { left: 150 },
    });
}

  // --- تغییرات (اگر نسخه تعمیر شده باشه) ---
if (versionB.changes) {
    const finalY = doc.lastAutoTable.finalY;
    doc.setFontSize(14);
    doc.text("تغییرات اعمال شده", 30, finalY + 20);

    versionB.changes.forEach((change, i) => {
    doc.setFontSize(12);
      doc.text(`• ${change}`, 30, finalY + 30 + i * 8);
    });
}

  // پاورقی
const finalPageY = doc.lastAutoTable?.finalY || 150;
if (finalPageY < 180) {
    doc.setFontSize(10);
    doc.text("تولید شده توسط سیستم مدیریت گزارش", 30, finalPageY + 15);
}

  // دانلود فایل
doc.save(`مقایسه_نسخه_ها_${Date.now()}.pdf`);
}

// توابع کمکی
function extractSheetData(workbook) {
const worksheet = workbook.Sheets["ورود داده"];
if (!worksheet) return null;

const jsonData = Object.values(worksheet).filter(cell => cell.v !== undefined);
if (jsonData.length === 0) return null;

const data = jsPDF.autoTableHtmlToJson(worksheet_to_array(worksheet));
return {
    headers: data.data[0] || [],
    rows: data.data.slice(1, 6), // فقط 5 ردیف اول
};
}

function worksheet_to_array(worksheet) {
const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
return json;
}

function getColumnStyles(colCount) {
const styles = {};
for (let i = 0; i < colCount; i++) {
    styles[i] = { cellWidth: 25 };
}
return styles;
}

// 🔁 تعریف XLSX در این فایل (موقت)
const XLSX = {
utils: {
    sheet_to_json: (sheet, opts) => {
    return Object.values(sheet)
        .reduce((out, r) => {
        if (r.r !== undefined && r.c !== undefined) {
            while (out.length <= r.r) out.push([]);
            out[r.r][r.c] = r.v;
        }
        return out;
        }, [])
        .filter(row => row.length > 0);
    }
}
};