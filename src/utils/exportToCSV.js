import { unparse } from "papaparse";

export function exportToCSV(trends, topTags, periodType = "monthly") {
  // آماده‌سازی داده‌ها برای CSV
  const csvData = trends.map((item) => {
    const row = {
      دوره: item.period,
      نوع: periodType === "monthly" ? "ماهانه" : "هفتگی",
    };

    // اضافه کردن تگ‌های برتر
    topTags.forEach((tag) => {
      row[tag] = item.tags[tag] || 0;
    });

    return row;
  });

  // ایجاد نام فایل با تاریخ
  const now = new Date();
  const filename = `روند_تگ_ها_${now.getFullYear()}-${now.getMonth()+1}-${now.getDate()}.csv`;

  // تولید و دانلود CSV
  const csv = unparse(csvData);

  // ایجاد لینک دانلود
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