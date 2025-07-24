import ExcelJS from "exceljs";

export async function exportExcelWithChart(historical, forecast, topTags) {
const workbook = new ExcelJS.Workbook();
const worksheet = workbook.addWorksheet("پیش‌بینی روند");

  // داده‌ها
const data = [];

historical.forEach(item => {
    const row = { نوع: "تاریخی", دوره: item.period };
    topTags.forEach(tag => { row[tag] = item.tags[tag] || 0; });
    data.push(row);
});

forecast.forEach(item => {
    const row = { نوع: "پیش‌بینی", دوره: item.period };
    topTags.forEach(tag => { row[tag] = item.tags[tag] || 0; });
    data.push(row);
});

  // ستون‌ها
const columns = [
    { header: "نوع", key: "نوع", width: 12 },
    { header: "دوره", key: "دوره", width: 14 },
    ...topTags.map(tag => ({ header: tag, key: tag, width: 12 })),
];

worksheet.columns = columns;
worksheet.addRows(data);

  // استایل سرستون
worksheet.getRow(1).font = { bold: true, name: "Tahoma", size: 12 };
worksheet.getRow(1).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF4F81BD" } };
worksheet.getRow(1).alignment = { horizontal: "center" };
worksheet.getRow(1).height = 20;

  // استایل داده‌ها
for (let i = 2; i <= data.length + 1; i++) {
    const row = worksheet.getRow(i);
    const isForecast = data[i - 2].نوع === "پیش‌بینی";

    row.font = { name: "Tahoma", size: 11 };
    if (isForecast) {
    row.font.italic = true;
    row.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF2DCDB" } };
    } else {
    row.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFDCE6F1" } };
    }
    row.alignment = { horizontal: "center" };
}

  // افزودن نمودار
const chart = worksheet.addChart({
    type: "line",
    name: "روند تگ‌ها",
    data: topTags.map(tag => ({
    name: tag,
    marker: "circle",
    smooth: true,
    values: data.map((d, i) => ({ x: i + 1, y: d[tag] || 0 })),
    })),
    title: { name: "پیش‌بینی روند استفاده از تگ‌ها" },
    legend: { position: "right" },
    xAxis: {
    label: "دوره زمانی",
    tickLabelRotation: 45,
    majorTickMark: "in",
    minorTickMark: "cross",
    numFmt: "General",
    },
    yAxis: {
    label: "تعداد استفاده",
    majorUnit: 1,
    },
    dispBlanksAs: "gap",
    showLegend: true,
});

  // تنظیم محل و اندازه نمودار
chart.editAs("twoCell")
    .from({ col: 0, row: data.length + 3 })
    .to({ col: columns.length + 1, row: data.length + 20 });

  // ایجاد فایل
const buffer = await workbook.xlsx.writeBuffer();

  // دانلود
const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
const url = URL.createObjectURL(blob);
const a = document.createElement("a");
a.href = url;
const now = new Date();
a.download = `پيش_بيني_روند_تگ_ها_${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}.xlsx`;
a.click();
URL.revokeObjectURL(url);
}