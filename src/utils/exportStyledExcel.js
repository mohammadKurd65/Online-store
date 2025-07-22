import * as XLSX from "xlsx";

export function exportStyledExcel(data, filename = "لاگ_اعلان_دائمی_استایل_دار.xlsx") {
const workbook = XLSX.utils.book_new();

  // تنظیمات فونت پیش‌فرض (برای پشتیبانی از فارسی)
const defaultFont = { name: "Tahoma", sz: 11, color: { rgb: "000000" } };
const headerFont = { name: "Tahoma", sz: 12, bold: true, color: { rgb: "FFFFFF" } };

  // استایل‌های سفارشی
const styles = {
    header: {
    font: headerFont,
      fill: { fgColor: { rgb: "4F81BD" } }, // آبی تیره
    alignment: { horizontal: "center", vertical: "center" },
    border: {
        top: { style: "thin", color: { rgb: "000000" } },
        bottom: { style: "thin", color: { rgb: "000000" } },
        left: { style: "thin", color: { rgb: "000000" } },
        right: { style: "thin", color: { rgb: "000000" } },
    },
    },
    cell: {
    font: defaultFont,
    alignment: { horizontal: "right", vertical: "center" },
    border: {
        top: { style: "thin", color: { rgb: "D0D0D0" } },
        bottom: { style: "thin", color: { rgb: "D0D0D0" } },
        left: { style: "thin", color: { rgb: "D0D0D0" } },
        right: { style: "thin", color: { rgb: "D0D0D0" } },
    },
    },
    actionCreate: { font: { ...defaultFont, color: { rgb: "006400" } } }, // سبز تیره
    actionUpdate: { font: { ...defaultFont, color: { rgb: "00008B" } } }, // آبی تیره
    actionDelete: { font: { ...defaultFont, color: { rgb: "8B0000" } } }, // قرمز تیره
    actionOther: { font: defaultFont },
};

  // آماده‌سازی داده‌ها
const rows = data.map((log) => ({
    عملیات: getActionLabel(log.action),
    ادمین: log.admin?.username || "ناشناس",
    شرح: log.description || "-",
    زمان: new Date(log.createdAt).toLocaleString("fa-IR"),
    "IP آدرس": log.ip,
    مرورگر: log.userAgent,
    "عنوان اعلان": log.newData?.title || log.previousData?.title || "-",
    "نوع اعلان": log.newData?.type || log.previousData?.type || "-",
}));

  // ساخت شیت
const worksheet = XLSX.utils.json_to_sheet(rows, { skipHeader: false });

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
];

  // اعمال استایل به سرستون
const headerRow = "A1:I1";
for (let cell in worksheet) {
    if (cell.match(/^([A-Z]+)1$/)) {
    worksheet[cell].s = styles.header;
    }
}

  // اعمال استایل به سلول‌ها و رنگ عملیات
for (let i = 2; i <= data.length + 1; i++) {
    const actionCell = `A${i}`;
    const action = data[i - 2].action;

    // استایل پایه
    for (let col of "ABCDEFGHI") {
    const cell = `${col}${i}`;
    if (worksheet[cell]) {
        worksheet[cell].s = styles.cell;
    }
    }

    // استایل خاص برای عملیات
    if (worksheet[actionCell]) {
    if (action === "create") {
        worksheet[actionCell].s = { ...styles.cell, ...styles.actionCreate };
    } else if (action === "update") {
        worksheet[actionCell].s = { ...styles.cell, ...styles.actionUpdate };
    } else if (action === "delete") {
        worksheet[actionCell].s = { ...styles.cell, ...styles.actionDelete };
    } else {
        worksheet[actionCell].s = { ...styles.cell, ...styles.actionOther };
    }
    }
}

  // اضافه کردن شیت به کاربرگ
XLSX.utils.book_append_sheet(workbook, worksheet, "لاگ‌های اعلان");

  // خروجی فایل
XLSX.writeFile(workbook, filename, { 
    bookType: "xlsx", 
    type: "binary",
    compression: true
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