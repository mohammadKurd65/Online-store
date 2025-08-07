const ScheduledReport = require("../models/ScheduledReportModel");
const ReportTemplate = require("../models/ReportTemplateModel");
const GeneratedReport = require("../models/GeneratedReportModel");
const Notification = require("../models/NotificationModel");
const moment = require("moment-jalaali");
const ExcelJS = require("exceljs");
const SharedComparison = require("../models/SharedComparisonModel");
const crypto = require("crypto");
const ShareViewLog = require("../models/ShareViewLogModel");
const parseUserAgent = require("ua-parser-js");
const { server, io } = require("../server");
const axios = require("axios");

// --- اشتراک مقایسه ---
exports.shareComparison = async (req, res) => {
const { versionA, versionB } = req.body;
try {
    const token = crypto.randomBytes(16).toString("hex");
    const shared = new SharedComparison({
    versionA,
    versionB,
    sharedBy: req.admin._id,
    token,
    });
    await shared.save();
    const shareLink = `${process.env.FRONTEND_URL || "http://localhost:3000"}/shared/comparison/${token}`;
    return res.json({
    success: true,
    shared,
    link: shareLink,
    });
} catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "خطای سرور" });
}
};

// --- دریافت مقایسه اشتراکی و ثبت بازدید ---
exports.getSharedComparison = async (req, res) => {
const { token } = req.params;
const ip = req.ip;
const userAgent = req.headers["user-agent"];
try {
    const shared = await SharedComparison.findOne({ token });
    if (!shared) return res.status(404).send("<h1>مقایسه یافت نشد.</h1>");
    if (shared.expiresAt < new Date()) return res.status(410).send("<h1>این لینک منقضی شده است.</h1>");

    // GeoIP
    let geoData = {};
    try {
    const geoRes = await axios.get(`https://ipapi.co/${ip}/json/`);
    geoData = {
        latitude: geoRes.data.latitude,
        longitude: geoRes.data.longitude,
        city: geoRes.data.city,
        country: geoRes.data.country_name,
        region: geoRes.data.region,
    };
    } catch (geoError) {
    console.error("GeoIP lookup failed", geoError);
    }

    // User Agent
    const ua = parseUserAgent(userAgent);
    const browser = `${ua.browser.name} ${ua.browser.version}`;
    const os = `${ua.os.name} ${ua.os.version}`;
    const device = ua.device.type || "Desktop";

    // ثبت بازدید
    const viewLog = new ShareViewLog({
    sharedComparison: shared._id,
    ip,
    userAgent,
    browser,
    os,
    device,
    ...geoData,
    });
    await viewLog.save();

    // افزایش بازدید
    shared.views += 1;
    await shared.save();

    // ارسال رویداد زنده
    const uniqueVisitors = await ShareViewLog.distinct("ip", { sharedComparison: shared._id }).then(ips => ips.length);
    io.emit("new_view", {
    sharedComparisonId: shared._id,
    ...geoData,
    viewedAt: new Date(),
    token: shared.token,
    view: {
        viewedAt: new Date(),
        ip,
        device,
        browser,
        os,
    },
    stats: {
        totalViews: shared.views,
        uniqueVisitors,
    }
    });

    res.render("sharedComparison", {
    versionA: shared.versionA,
    versionB: shared.versionB,
    createdAt: shared.createdAt,
    expiresAt: shared.expiresAt,
    views: shared.views,
    });
} catch (error) {
    console.error(error);
    return res.status(500).send("<h1>خطای سرور</h1>");
}
};

// --- پردازش قالب ورود داده ---
exports.processDataEntryTemplate = async (req, res) => {
if (!req.file) {
    return res.status(400).json({ success: false, message: "فایلی آپلود نشد." });
}
try {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(req.file.path);
    const worksheet = workbook.getWorksheet("ورود داده");
    const reports = [];
    let errors = [];
    worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
    if (rowNumber === 1) return;
    const [title, name, format, tags, date, count, adminName, description] = row.values.slice(1);
    if (!title || !name || !format || !date) {
        errors.push(`ردیف ${rowNumber}: فیلدهای ضروری پر نشده‌اند.`);
        return;
    }
    if (!["PDF", "Excel"].includes(format)) {
        errors.push(`ردیف ${rowNumber}: فرمت باید PDF یا Excel باشد.`);
        return;
    }
    reports.push({
        title,
        name,
        format: format.toLowerCase(),
        tags: tags ? tags.split(",").map(t => t.trim()) : [],
        createdAt: parseJalaliDate(date),
        count: parseInt(count) || 1,
        adminName,
        description: description || "",
    });
    });
    if (errors.length > 0) {
    return res.status(400).json({ success: false, message: "خطاهایی در فایل وجود دارد.", errors });
    }
    for (const report of reports) {
    const newReport = new GeneratedReport({
        ...report,
        admin: req.admin._id,
        fileSize: 0,
        fileUrl: "/no-file",
    });
    await newReport.save();
    }
    return res.json({
    success: true,
    message: `${reports.length} گزارش با موفقیت وارد شد.`,
    imported: reports.length,
    });
} catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "خطای پردازش فایل." });
}
};

// --- تبدیل تاریخ شمسی به میلادی ---
function parseJalaliDate(jalaliStr) {
const [y, m, d] = jalaliStr.split("/").map(Number);
return new Date(y, m - 1, d);
}

// --- رگرسیون خطی ساده ---
function linearRegression(x, y) {
const n = y.length;
let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;
for (let i = 0; i < n; i++) {
    sumX += x[i];
    sumY += y[i];
    sumXY += x[i] * y[i];
    sumXX += x[i] * x[i];
}
  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;
return { slope, intercept };
}

// --- پیش‌بینی روند تگ‌ها ---
exports.predictTagTrends = async (req, res) => {
const { period = "monthly", forecast = 3 } = req.query;
const adminId = req.admin._id;
try {
    // مرحله ۱: دریافت داده‌های تاریخی
    const pipeline = [
    { $match: { admin: adminId } },
    { $unwind: "$tags" },
    {
        $group: {
        _id: {
            period: {
            $dateToString: {
                format: period === "monthly" ? "%Y-%m" : "%Y-%U",
                date: "$createdAt",
            },
            },
            tag: "$tags",
        },
        count: { $sum: 1 },
        },
    },
    {
        $group: {
        _id: "$_id.period",
        tags: {
            $push: {
            k: "$_id.tag",
            v: "$count",
            },
        },
        },
    },
    {
        $addFields: {
        tags: { $arrayToObject: "$tags" },
        },
    },
    { $sort: { _id: 1 } },
    ];
    const result = await GeneratedReport.aggregate(pipeline);
    if (result.length < 2) {
    return res.json({
        success: true,
        message: "داده کافی برای پیش‌بینی وجود ندارد.",
        predictions: {},
        historical: [],
        forecast: [],
        topTags: []
    });
    }
    // مرحله ۲: تعیین تگ‌های برتر (۵ تا)
    const tagCounts = {};
    result.forEach(r => {
    Object.keys(r.tags).forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + r.tags[tag];
    });
    });
    const topTags = Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([tag]) => tag);

    // مرحله ۳: پیش‌بینی با WMA
    const wmaPredictions = {};
    const windowSize = Math.min(3, result.length);
    topTags.forEach(tag => {
    const values = result.map(r => r.tags[tag] || 0);
    const weights = Array.from({ length: windowSize }, (_, i) => i + 1);
    const sumWeights = weights.reduce((a, b) => a + b, 0);
    const lastWindow = values.slice(-windowSize);
      const predicted = lastWindow.reduce((sum, val, i) => sum + val * weights[i], 0) / sumWeights;
    wmaPredictions[tag] = Math.max(0, Math.round(predicted));
    });

    // مرحله ۴: ساخت داده‌های نمایشی
    const historical = result.map(item => {
    const periodLabel = period === "monthly"
        ? moment(item._id, "YYYY-MM").format("jYYYY/jMM")
        : `هفته ${item._id.split("-")[1]}`;
    return {
        period: periodLabel,
        tags: item.tags,
    };
    });

    const forecastArr = [];
    let lastPeriod = result[result.length - 1]._id;
    for (let i = 1; i <= forecast; i++) {
    const futurePeriod = addPeriod(lastPeriod, period, i);
    const futureLabel = period === "monthly"
        ? moment(futurePeriod, "YYYY-MM").format("jYYYY/jMM")
        : `هفته ${futurePeriod.split("-")[1]}`;
    const forecastedTags = { ...wmaPredictions };
    forecastArr.push({
        period: futureLabel,
        tags: forecastedTags
    });
    lastPeriod = futurePeriod;
    }

    return res.json({
    success: true,
    predictions: wmaPredictions,
    historical,
    forecast: forecastArr,
    topTags,
    });
} catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "خطای سرور" });
}
};

// --- افزودن دوره ---
function addPeriod(period, type, months) {
const [year, month] = period.split("-");
const date = new Date(parseInt(year), parseInt(month) - 1);
date.setMonth(date.getMonth() + months);
return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

// --- روند تگ‌ها ---
exports.getTagTrends = async (req, res) => {
const { period = "monthly", topN = 5, limit = 12 } = req.query;
const adminId = req.admin._id;
try {
    let dateField, dateFormat;
    if (period === "weekly") {
    dateField = "week";
    dateFormat = "YYYY-[هفته ]W";
    } else {
    dateField = "month";
    dateFormat = "jYYYY/jMM";
    }
    const pipeline = [
    { $match: { admin: adminId } },
    { $unwind: "$tags" },
    {
        $group: {
        _id: {
            [dateField]: {
            $dateToString: {
                format: period === "monthly" ? "%Y-%m" : "%Y-%U",
                date: "$createdAt",
            },
            },
            tag: "$tags",
        },
        count: { $sum: 1 },
        },
    },
    { $sort: { "_id.date": 1 } },
    {
        $group: {
        _id: "$_id.date",
        tags: {
            $push: {
            k: "$_id.tag",
            v: "$count",
            },
        },
        },
    },
    {
        $addFields: {
        tags: { $arrayToObject: "$tags" },
        },
    },
    { $sort: { _id: -1 } },
    { $limit: parseInt(limit) },
    { $sort: { _id: 1 } },
    ];
    const result = await GeneratedReport.aggregate(pipeline);
    const trends = result.map(item => {
    const periodLabel = period === "monthly"
        ? moment(item._id, "YYYY-MM").format("jYYYY/jMM")
        : `هفته ${item._id.split("-")[1]}`;
    return {
        period: periodLabel,
        tags: item.tags,
    };
    });
    const tagCounts = {};
    trends.forEach(t => {
    Object.keys(t.tags).forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + t.tags[tag];
    });
    });
    const topTags = Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, parseInt(topN))
    .map(([tag]) => tag);
    return res.json({
    success: true,
    trends,
    topTags,
    });
} catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "خطای سرور" });
}
};

// --- آرشیو گزارش‌ها ---
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
if (format) query.format = format;
if (tag) query.tags = tag;
try {
    const reports = await GeneratedReport.find(query).sort({ createdAt: -1 });
    return res.json({ success: true, reports });
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
    // fs.unlinkSync(report.fileUrl); // اختیاری
    return res.json({ success: true, message: "گزارش از آرشیو حذف شد." });
} catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "خطای سرور" });
}
};

// --- قالب‌های گزارش ---
exports.getReportTemplates = async (req, res) => {
try {
    const templates = await ReportTemplate.find({ admin: req.admin._id });
    return res.json({ success: true, templates });
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
    return res.status(201).json({ success: true, saved });
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
    return res.json({ success: true, updated });
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

// --- گزارش‌های زمان‌بندی شده ---
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

// --- گزارش‌های تولید شده ---
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

// --- ویرایش تگ‌های گزارش ---
exports.updateReportTags = async (req, res) => {
const { id } = req.params;
const { tags } = req.body;
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

// --- تگ‌های محبوب ---
exports.getPopularTags = async (req, res) => {
try {
    const tags = await GeneratedReport.aggregate([
    { $match: { admin: req.admin._id } },
    { $unwind: "$tags" },
    { $group: { _id: "$tags", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 50 },
    ]);
    return res.json({
    success: true,
    tags,
    });
} catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "خطای سرور" });
}
};

// --- آنالیتیکس اشتراک ---
exports.getShareAnalytics = async (req, res) => {
const { token } = req.params;
try {
    const shared = await SharedComparison.findOne({ token });
    if (!shared) {
    return res.status(404).json({ success: false, message: "لینک یافت نشد." });
    }
    if (shared.sharedBy.toString() !== req.admin._id.toString()) {
    return res.status(403).json({ success: false, message: "دسترسی غیرمجاز" });
    }
    const logs = await ShareViewLog.find({ sharedComparison: shared._id })
    .sort({ viewedAt: -1 });
    const totalViews = logs.length;
    const uniqueIPs = new Set(logs.map(log => log.ip)).size;
    const stats = {
    totalViews,
    uniqueVisitors: uniqueIPs,
    firstView: logs.length > 0 ? logs[logs.length - 1].viewedAt : null,
    lastView: logs.length > 0 ? logs[0].viewedAt : null,
    devices: logs.reduce((acc, log) => {
        acc[log.device] = (acc[log.device] || 0) + 1;
        return acc;
    }, {}),
    browsers: logs.reduce((acc, log) => {
        acc[log.browser] = (acc[log.browser] || 0) + 1;
        return acc;
    }, {}),
    os: logs.reduce((acc, log) => {
        acc[log.os] = (acc[log.os] || 0) + 1;
        return acc;
    }, {}),
    };
    return res.json({
    success: true,
    shared,
    stats,
    logs,
    });
} catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "خطای سرور" });
}
};

// --- نوتیفیکیشن ---
const createNotification = async (userId, type, title, message, data = {}) => {
const notification = new Notification({
    user: userId,
    type,
    title,
    message,
    data,
});
await notification.save();
io.to(`admin:${userId}`).emit("new_notification", notification);
};

// نمونه استفاده از createNotification در یک هندلر:
exports.createReportAndNotify = async (req, res) => {
try {
    // ... تولید گزارش ...
    const newReport = new GeneratedReport({
      // ... مقادیر ...
    admin: req.admin._id,
    });
    await newReport.save();
    await createNotification(
    req.admin._id,
    "REPORT",
    "گزارش جدید تولید شد",
    `گزارش "${newReport.title}" با موفقیت تولید شد.`,
    { reportId: newReport._id }
    );
    return res.json({ success: true, report: newReport });
} catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "خطای سرور" });
}
};