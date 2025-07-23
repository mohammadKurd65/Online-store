const ScheduledReport = require("../models/ScheduledReportModel");
const ReportTemplate = require("../models/ReportTemplateModel");
const GeneratedReport = require("../models/GeneratedReportModel");


exports.getReportArchive = async (req, res) => {
const { search, startDate, endDate, format, tag } = req.query;
const query = { admin: req.admin._id };

if (search) {
    query.$or = [
    { name: { $regex: search, $options: "i" } },
    { title: { $regex: search, $options: "i" } },
    ];
}

if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) query.createdAt.$gte = new Date(startDate);
    if (endDate) query.createdAt.$lte = new Date(endDate);
}

if (format) {
    query.format = format;
}

if (tag) {
    query.tags = tag;
}

try {
    const reports = await GeneratedReport.find(query).sort({ createdAt: -1 });
    return res.json({ success: true,  reports });
} catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "خطای سرور" });
}
};

exports.deleteFromArchive = async (req, res) => {
const { id } = req.params;
try {
    const report = await GeneratedReport.findOneAndDelete({ _id: id, admin: req.admin._id });
    if (!report) {
    return res.status(404).json({ success: false, message: "گزارش یافت نشد." });
    }

    // حذف فایل از دیسک (اختیاری)
    // fs.unlinkSync(report.fileUrl);

    return res.json({ success: true, message: "گزارش از آرشیو حذف شد." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "خطای سرور" });
  }
};

exports.getReportTemplates = async (req, res) => {
try {
    const templates = await ReportTemplate.find({ admin: req.admin._id });
    return res.json({ success: true,  templates });
} catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "خطای سرور" });
}
};

exports.createReportTemplate = async (req, res) => {
try {
    const template = new ReportTemplate({
    ...req.body,
    admin: req.admin._id,
    });
    const saved = await template.save();
    return res.status(201).json({ success: true,  saved });
} catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "خطای سرور" });
}
};

exports.updateReportTemplate = async (req, res) => {
const { id } = req.params;
try {
    const updated = await ReportTemplate.findOneAndUpdate(
    { _id: id, admin: req.admin._id },
    req.body,
    { new: true }
    );
    if (!updated) {
    return res.status(404).json({ success: false, message: "قالب یافت نشد." });
    }
    return res.json({ success: true,  updated });
} catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "خطای سرور" });
}
};

exports.deleteReportTemplate = async (req, res) => {
const { id } = req.params;
try {
    await ReportTemplate.findOneAndDelete({ _id: id, admin: req.admin._id });
    return res.json({ success: true, message: "قالب حذف شد." });
} catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "خطای سرور" });
}
};

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



exports.getGeneratedReports = async (req, res) => {
try {
    const reports = await GeneratedReport.find({ admin: req.admin._id }).sort({ createdAt: -1 });
    return res.json({ success: true, data: reports });
} catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "خطای سرور" });
}
};

exports.deleteGeneratedReport = async (req, res) => {
const { id } = req.params;
try {
    await GeneratedReport.findOneAndDelete({ _id: id, admin: req.admin._id });
    return res.json({ success: true, message: "گزارش حذف شد." });
} catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "خطای سرور" });
}
};

exports.updateReportTags = async (req, res) => {
const { id } = req.params;
const { tags } = req.body;

  // اعتبارسنجی
if (!Array.isArray(tags)) {
    return res.status(400).json({ success: false, message: "فرمت تگ‌ها نامعتبر است." });
}

try {
    const updated = await GeneratedReport.findOneAndUpdate(
    { _id: id, admin: req.admin._id },
    { tags },
    { new: true }
    );

    if (!updated) {
    return res.status(404).json({ success: false, message: "گزارش یافت نشد." });
    }

    return res.json({
    success: true,
    updated,
    });
} catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "خطای سرور" });
}
};