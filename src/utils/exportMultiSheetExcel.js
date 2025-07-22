import * as XLSX from "xlsx";


export function exportMultiSheetExcel(data, filename = "لاگ_چند_برگی.xlsx") {
const workbook = XLSX.utils.book_new();


  // تنظیمات فونت و استایل
const defaultFont = { name: "Tahoma", sz: 11, color: { rgb: "000000" } };
const headerFont = { name: "Tahoma", sz: 12, bold: true, color: { rgb: "FFFFFF" } };

const styles = {
    header: {
    font: headerFont,
      fill: { fgColor: { rgb: "4F81BD" } }, // آبی
    alignment: { horizontal: "center", vertical: "center" },
    border: thinBorder,
    },
    cell: {
    font: defaultFont,
    alignment: { horizontal: "right", vertical: "center" },
    border: thinBorder,
    },
    create: { font: { ...defaultFont, color: { rgb: "006400" } } }, // سبز تیره
    update: { font: { ...defaultFont, color: { rgb: "00008B" } } }, // آبی تیره
    delete: { font: { ...defaultFont, color: { rgb: "8B0000" } } }, // قرمز تیره
};

const thinBorder = {
    top: { style: "thin", color: { rgb: "D0D0D0" } },
    bottom: { style: "thin", color: { rgb: "D0D0D0" } },
    left: { style: "thin", color: { rgb: "D0D0D0" } },
    right: { style: "thin", color: { rgb: "D0D0D0" } },
};

  // تابع تبدیل داده به شیت
function createSheet(data, sheetName) {
    if (data.length === 0) {
    return XLSX.utils.aoa_to_sheet([["هیچ داده‌ای وجود ندارد."]]);
    }

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

    const worksheet = XLSX.utils.json_to_sheet(rows, { skipHeader: false });

    // تنظیم عرض ستون‌ها
    worksheet["!cols"] = [
    { wch: 15 }, { wch: 15 }, { wch: 20 }, { wch: 20 },
    { wch: 15 }, { wch: 25 }, { wch: 25 }, { wch: 15 }
    ];

    // اعمال استایل به سرستون
    const headerRow = "A1:H1";
    for (let cell in worksheet) {
    if (cell.match(/^([A-Z]+)1$/)) {
        worksheet[cell].s = styles.header;
    }
    }

    // اعمال استایل به سلول‌ها
    for (let i = 2; i <= data.length + 1; i++) {
    const action = data[i - 2].action;
    for (let col of "ABCDEFGH") {
        const cell = `${col}${i}`;
        if (worksheet[cell]) {
        worksheet[cell].s = styles.cell;
        }
    }

    const actionCell = `A${i}`;
    if (worksheet[actionCell]) {
        if (action === "create") {
        worksheet[actionCell].s = { ...styles.cell, ...styles.create };
        } else if (action === "update") {
        worksheet[actionCell].s = { ...styles.cell, ...styles.update };
        } else if (action === "delete") {
        worksheet[actionCell].s = { ...styles.cell, ...styles.delete };
        }
    }
    }

// تابع ایجاد شیت خلاصه
function createSummarySheet(data) {
  // محاسبه آمار
  const total = data.length;
  const creates = data.filter((log) => log.action === "create").length;
  const updates = data.filter((log) => log.action === "update").length;
  const deletes = data.filter((log) => log.action === "delete").length;
  const uniqueAdmins = new Set(data.map((log) => log.admin?._id)).size;

  const lastLog = data[0]; // اخیراً اضافه شده (آخرین آیتم)
  const lastAction = lastLog
    ? `${getActionLabel(lastLog.action)} توسط ${lastLog.admin?.username || "ناشناس"}`
    : "—";

  const summaryData = [
    ["خلاصه آماری لاگ‌های اعلان دائمی", ""],
    [""],
    ["متر", "مقدار"],
    ["تعداد کل لاگ‌ها", total],
    ["ایجاد شده", creates],
    ["ویرایش شده", updates],
    ["حذف شده", deletes],
    ["تعداد ادمین‌های فعال", uniqueAdmins],
    ["آخرین عملیات", lastAction],
    ["تاریخ گزارش", new Date().toLocaleString("fa-IR")],
  ];

  const worksheet = XLSX.utils.aoa_to_sheet(summaryData);

  // تنظیم عرض ستون‌ها
  worksheet["!cols"] = [{ wch: 20 }, { wch: 30 }];

  // استایل‌دهی
  const headerFont = { name: "Tahoma", sz: 12, bold: true, color: { rgb: "FFFFFF" } };
  const titleFont = { name: "Tahoma", sz: 14, bold: true, color: { rgb: "000080" } }; // آبی تیره

  // استایل سلول‌ها
  worksheet["A1"].s = { font: titleFont, alignment: { horizontal: "center" } };
  worksheet["A3"].s = { 
    font: headerFont, 
    fill: { fgColor: { rgb: "4F81BD" } }, 
    alignment: { horizontal: "center" } 
  };
  worksheet["B3"].s = { 
    font: headerFont, 
    fill: { fgColor: { rgb: "4F81BD" } }, 
    alignment: { horizontal: "center" } 
  };

  // استایل داده‌ها
  for (let i = 4; i <= 9; i++) {
    worksheet[`A${i}`].s = { 
      font: { name: "Tahoma", sz: 11 }, 
      alignment: { horizontal: "right" } 
    };
    worksheet[`B${i}`].s = { 
      font: { name: "Tahoma", sz: 11, bold: true }, 
      alignment: { horizontal: "right" } 
    };
  }

  // اضافه کردن border به داده‌ها
  const dataRange = "A4:B9";
  for (let cell in worksheet) {
    if (cell.match(/^[A-B][4-9]$/)) {
      worksheet[cell].s = {
        ...worksheet[cell].s,
        border: {
          top: { style: "thin", color: { rgb: "D0D0D0" } },
          bottom: { style: "thin", color: { rgb: "D0D0D0" } },
          left: { style: "thin", color: { rgb: "D0D0D0" } },
          right: { style: "thin", color: { rgb: "D0D0D0" } },
        },
      };
    }
  }

  return worksheet;
}

    return worksheet;
}

  // داده‌ها رو فیلتر کن
const allLogs = data;
const creates = data.filter((log) => log.action === "create");
const updates = data.filter((log) => log.action === "update");
const deletes = data.filter((log) => log.action === "delete");

  // اضافه کردن شیت‌ها
XLSX.utils.book_append_sheet(workbook, createSheet(allLogs, "همه"), "همه لاگ‌ها");
XLSX.utils.book_append_sheet(workbook, createSheet(creates, "ایجاد"), "ایجاد شده");
XLSX.utils.book_append_sheet(workbook, createSheet(updates, "ویرایش"), "ویرایش شده");
XLSX.utils.book_append_sheet(workbook, createSheet(deletes, "حذف"), "حذف شده");

  // خروجی فایل
XLSX.writeFile(workbook, filename, { 
    bookType: "xlsx", 
    type: "binary",
    compression: true 
});
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