const ScheduledReport = require("../models/ScheduledReportModel");

exports.getAllScheduledReports = async (req, res) => {
try {
    const reports = await ScheduledReport.find({ admin: req.admin._id });
    return res.json({
    success: true,
    reports,
    });
} catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "خطای سرور" });
}
};

exports.createScheduledReport = async (req, res) => {
try {
    const report = new ScheduledReport({
    ...req.body,
    admin: req.admin._id,
    });
    const saved = await report.save();
    return res.status(201).json({
    success: true,
    saved,
    });
} catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "خطای سرور" });
}
};

exports.deleteScheduledReport = async (req, res) => {
const { id } = req.params;
try {
    await ScheduledReport.findOneAndDelete({ _id: id, admin: req.admin._id });
    return res.json({
    success: true,
    message: "گزارش خودکار با موفقیت حذف شد.",
    });
} catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "خطای سرور" });
}
};