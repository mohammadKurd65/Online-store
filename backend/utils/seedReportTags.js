const GeneratedReport = require("../models/GeneratedReportModel");

const defaultTags = ["مالی", "عملیات", "امنیت", "هفتگی", "ماهانه", "فوری", "آزمایشی"];

const seedReportTags = async () => {
try {
    const existing = await GeneratedReport.distinct("tags");
    const newTags = defaultTags.filter((tag) => !existing.includes(tag));
    if (newTags.length > 0) {
    console.log(`✅ تگ‌های پیش‌فرض اضافه شد: ${newTags.join(", ")}`);
    }
} catch (err) {
    console.error("❌ خطای seed تگ‌ها:", err);
}
};

module.exports = seedReportTags;