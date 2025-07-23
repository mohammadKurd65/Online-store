import * as XLSX from "xlsx";

export function exportToExcel(trends, topTags, periodType = "monthly") {
  // آماده‌سازی داده‌ها
  const worksheetData = trends.map((item) => {
    const row = {
      "دوره": item.period,
      "نوع": periodType === "monthly" ? "ماهانه" : "هفتگی",
    };

    // اضافه کردن تگ‌های برتر
    topTags.forEach((tag) => {
      row[tag] = item.tags[tag] || 0;
    });

    return row;
  });

  // ساخت شیت
  const worksheet = XLSX.utils.json_to_sheet(worksheetData);

  // تنظیم عرض ستون‌ها
  worksheet["!cols"] = [
    { wch: 12 }, // دوره
    { wch: 10 }, // نوع
    ...topTags.map(() => ({ wch: 12 })), // تگ‌ها
  ];

  // تنظیم ارتفاع سرستون
  worksheet["!rows"] = [{ hpt: 20 }];

  // اعمال استایل به سرستون
  const headerStyle = {
    font: { name: "Tahoma", sz: 12, bold: true, color: { rgb: "FFFFFF" } },
    fill: { fgColor: { rgb: "4F81BD" } }, // آبی تیره
    alignment: { horizontal: "center", vertical: "center" },
    border: {
      top: { style: "thin", color: { rgb: "000000" } },
      bottom: { style: "thin", color: { rgb: "000000" } },
      left: { style: "thin", color: { rgb: "000000" } },
      right: { style: "thin", color: { rgb: "000000" } },
    },
  };

  // اعمال استایل به سلول‌ها
  const cellStyle = {
    font: { name: "Tahoma", sz: 11 },
    alignment: { horizontal: "center", vertical: "center" },
    border: {
      top: { style: "thin", color: { rgb: "D0D0D0" } },
      bottom: { style: "thin", color: { rgb: "D0D0D0" } },
      left: { style: "thin", color: { rgb: "D0D0D0" } },
      right: { style: "thin", color: { rgb: "D0D0D0" } },
    },
  };

  // اعمال استایل به سرستون
  const range = XLSX.utils.decode_range(worksheet["!ref"]);
  for (let C = range.s.c; C <= range.e.c; ++C) {
    const cell = XLSX.utils.encode_cell({ r: 0, c: C });
    if (worksheet[cell]) {
      worksheet[cell].s = headerStyle;
    }
  }

  // اعمال استایل به داده‌ها
  for (let R = 1; R <= range.e.r; ++R) {
    for (let C = 0; C <= range.e.c; ++C) {
      const cell = XLSX.utils.encode_cell({ r: R, c: C });
      if (worksheet[cell]) {
        worksheet[cell].s = cellStyle;
      }
    }
  }

  // ساخت کاربرگ
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "روند تگ‌ها");

  // خروجی فایل
  const now = new Date();
  const filename = `روند_تگ_ها_${now.getFullYear()}-${now.getMonth()+1}-${now.getDate()}.xlsx`;
  XLSX.writeFile(workbook, filename, { 
    bookType: "xlsx", 
    type: "binary",
    compression: true 
  });
}