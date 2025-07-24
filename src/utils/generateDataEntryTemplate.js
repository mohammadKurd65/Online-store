import ExcelJS from "exceljs";

export async function generateDataEntryTemplate() {
const workbook = new ExcelJS.Workbook();
const worksheet = workbook.addWorksheet("ورود داده");

  // --- ساختار داده ---
const headers = [
    "عنوان گزارش",
    "نام گزارش",
    "فرمت",
    "تگ‌ها (با کاما جدا کنید)",
    "تاریخ ایجاد (سال/ماه/روز)",
    "تعداد استفاده",
    "نام ادمین",
    "توضیحات"
];

  // --- تنظیم ستون‌ها ---
worksheet.columns = headers.map(() => ({ width: 20 }));

  // --- سرستون ---
const headerRow = worksheet.getRow(1);
headers.forEach((header, index) => {
    const cell = worksheet.getCell(1, index + 1);
    cell.value = header;
    cell.font = { bold: true, name: "Tahoma", size: 12, color: { argb: "FFFFFFFF" } };
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF4F81BD" } };
    cell.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
    cell.border = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" }
    };
});

  // --- راهنما ---
const instructions = worksheet.getCell("A3");
instructions.value = "راهنمای پر کردن فرم:";
instructions.font = { bold: true, name: "Tahoma", size: 12 };
instructions.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFCE4D6" } };

const instructionList = [
    "• هر ردیف یک گزارش است",
    "• فرمت: PDF یا Excel",
    "• تگ‌ها را با کاما جدا کنید: مالی,عملیات",
    "• تاریخ را به فرمت شمسی بنویسید: 1403/05/10",
    "• از ردیف 5 به بعد داده وارد کنید"
];

instructionList.forEach((text, i) => {
    const cell = worksheet.getCell(`A${4 + i}`);
    cell.value = text;
    cell.font = { name: "Tahoma", size: 11 };
    cell.alignment = { horizontal: "right", vertical: "middle" };
});

  // --- نمونه داده ---
worksheet.addRow([]);
const sampleRow = worksheet.addRow([
    "گزارش ماهانه عملیات",
    "report-001",
    "PDF",
    "عملیات,ماهانه",
    "1403/05/10",
    1,
    "admin1",
    "گزارش ماهانه"
]);

sampleRow.eachCell((cell) => {
    cell.font = { name: "Tahoma", size: 11 };
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFFFFCC" } };
    cell.alignment = { horizontal: "center" };
    cell.border = {
    top: { style: "thin", color: { argb: "FFD0D0D0" } },
    bottom: { style: "thin", color: { argb: "FFD0D0D0" } },
    left: { style: "thin", color: { argb: "FFD0D0D0" } },
    right: { style: "thin", color: { argb: "FFD0D0D0" } }
    };
});

  // --- افزودن اعتبارسنجی (Data Validation) ---
  // محدود کردن فرمت به PDF یا Excel
const formatCol = worksheet.getColumn(3);
formatCol.eachCell({ includeEmpty: false }, (cell, rowNumber) => {
    if (rowNumber > 1) {
    cell.dataValidation = {
        type: "list",
        allowBlank: false,
        formulae: ['"PDF,Excel"'],
        showErrorMessage: true,
        errorStyle: "error",
        errorTitle: "مقدار نامعتبر",
        error: "لطفاً فقط PDF یا Excel وارد کنید."
    };
    }
});

  // --- تنظیمات برگه ---
worksheet.views = [{ state: "frozen", ySplit: 1 }];
worksheet.autoFilter = {
    from: "A1",
    to: `${String.fromCharCode(64 + headers.length)}1`
};

  // --- ایجاد فایل ---
const buffer = await workbook.xlsx.writeBuffer();

  // --- دانلود ---
const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
const url = URL.createObjectURL(blob);
const a = document.createElement("a");
a.href = url;
a.download = "قالب_ورود_داده_گزارش.xlsx";
a.click();
URL.revokeObjectURL(url);
}