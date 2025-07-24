import { unparse } from "papaparse";

export function exportPredictionToCSV(historical, forecast, topTags) {
  // آماده‌سازی داده‌ها
const csvData = [];

  // اضافه کردن داده‌های تاریخی
historical.forEach(item => {
    const row = {
    نوع: "تاریخی",
    دوره: item.period,
    };
    topTags.forEach(tag => {
    row[tag] = item.tags[tag] || 0;
    });
    csvData.push(row);
});

  // اضافه کردن داده‌های پیش‌بینی
forecast.forEach(item => {
    const row = {
    نوع: "پیش‌بینی",
    دوره: item.period,
    };
    topTags.forEach(tag => {
    row[tag] = item.tags[tag] || 0;
    });
    csvData.push(row);
});

  // ایجاد نام فایل با تاریخ
const now = new Date();
const filename = `پيش_بيني_روند_تگ_ها_${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}.csv`;

  // تولید CSV
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