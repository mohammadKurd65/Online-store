import * as XLSX from "xlsx";

export function exportPredictionToExcel(historical, forecast, topTags) {
  // آماده‌سازی داده‌ها
const worksheetData = [];

  // داده‌های تاریخی
historical.forEach(item => {
    const row = {
    نوع: "تاریخی",
    دوره: item.period,
    };
    topTags.forEach(tag => {
    row[tag] = item.tags[tag] || 0;
    });
    worksheetData.push(row);
});

  // داده‌های پیش‌بینی
forecast.forEach(item => {
    const row = {
    نوع: "پیش‌بینی",
    دوره: item.period,
    };
    topTags.forEach(tag => {
    row[tag] = item.tags[tag] || 0;
    });
    worksheetData.push(row);
});

  // ساخت شیت
const worksheet = XLSX.utils.json_to_sheet(worksheetData);

  // تنظیم عرض ستون‌ها
worksheet["!cols"] = [
    { wch: 12 }, // نوع
    { wch: 12 }, // دوره
    ...topTags.map(() => ({ wch: 12 })), // تگ‌ها
];

  // استایل‌ها
const styles = {
    header: {
    font: { name: "Tahoma", sz: 12, bold: true, color: { rgb: "FFFFFF" } },
      fill: { fgColor: { rgb: "4F81BD" } }, // آبی تیره
    alignment: { horizontal: "center", vertical: "center" },
    border: thinBorder,
    },
    historical: {
    font: { name: "Tahoma", sz: 11 },
      fill: { fgColor: { rgb: "DCE6F1" } }, // آبی روشن
    alignment: { horizontal: "center" },
    border: thinBorder,
    },
    forecast: {
    font: { name: "Tahoma", sz: 11, italic: true },
      fill: { fgColor: { rgb: "F2DCDB" } }, // صورتی روشن
    alignment: { horizontal: "center" },
    border: thinBorder,
    },
};

const thinBorder = {
    top: { style: "thin", color: { rgb: "D0D0D0" } },
    bottom: { style: "thin", color: { rgb: "D0D0D0" } },
    left: { style: "thin", color: { rgb: "D0D0D0" } },
    right: { style: "thin", color: { rgb: "D0D0D0" } },
};

  // اعمال استایل به سرستون
const range = XLSX.utils.decode_range(worksheet["!ref"]);
for (let C = 0; C <= range.e.c; C++) {
    const cell = XLSX.utils.encode_cell({ r: 0, c: C });
    if (worksheet[cell]) {
    worksheet[cell].s = styles.header;
    }
}

  // اعمال استایل به سلول‌ها
for (let R = 1; R <= range.e.r; R++) {
    const typeCell = XLSX.utils.encode_cell({ r: R, c: 0 });
    const isForecast = worksheet[typeCell]?.v === "پیش‌بینی";
    const rowStyle = isForecast ? styles.forecast : styles.historical;

    for (let C = 0; C <= range.e.c; C++) {
    const cell = XLSX.utils.encode_cell({ r: R, c: C });
    if (worksheet[cell]) {
        worksheet[cell].s = rowStyle;
    }
    }
}

  // ساخت کاربرگ
const workbook = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(workbook, worksheet, "پیش‌بینی روند");

  // نام فایل
const now = new Date();
const filename = `پيش_بيني_روند_تگ_ها_${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}.xlsx`;

  // خروجی
XLSX.writeFile(workbook, filename, { 
    bookType: "xlsx", 
    type: "binary",
    compression: true 
});
}