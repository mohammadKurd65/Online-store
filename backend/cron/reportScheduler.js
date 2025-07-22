const cron = require("node-cron");
const ScheduledReport = require("../models/ScheduledReportModel");
const { sendReportByEmail } = require("../services/emailService");

// هر صبح در ساعت مشخص
cron.schedule("0 9 * * *", async () => {
console.log("چک کردن گزارش‌های روزانه...");
const now = new Date();
  const time = now.toTimeString().slice(0, 5); // "09:00"

const reports = await ScheduledReport.find({
    frequency: "daily",
    startTime: time,
});

for (const report of reports) {
    await sendReportByEmail(report.email, report.format);
}
});

// هر دوشنبه ساعت 9
cron.schedule("0 9 * * 1", async () => {
const reports = await ScheduledReport.find({
    frequency: "weekly",
    startTime: "09:00",
});

for (const report of reports) {
    await sendReportByEmail(report.email, report.format);
}
});

// اول هر ماه
cron.schedule("0 9 1 * *", async () => {
const reports = await ScheduledReport.find({
    frequency: "monthly",
    startTime: "09:00",
});

for (const report of reports) {
    await sendReportByEmail(report.email, report.format);
}
});