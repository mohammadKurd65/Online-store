const ScheduledReport = require("../models/ScheduledReportModel");
const ReportTemplate = require("../models/ReportTemplateModel");
const GeneratedReport = require("../models/GeneratedReportModel");
const moment = require("moment-jalaali"); // برای تاریخ شمسی


// تابع ساده رگرسیون خطی
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

exports.predictTagTrends = async (req, res) => {
const { period = "monthly", forecast = 3 } = req.query;
const adminId = req.admin._id;

try {
    // --- مرحله ۱: دریافت داده‌های تاریخی ---
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

    // --- مرحله ۲: تعیین تگ‌های برتر (5 تا) ---
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

    // --- مرحله ۳: محاسبه پیش‌بینی با WMA (Weighted Moving Average) ---
    const wmaPredictions = {};
    const windowSize = Math.min(3, result.length); // آخرین 3 دوره

    topTags.forEach(tag => {
    const values = result.map(r => r.tags[tag] || 0);
      const weights = Array.from({ length: windowSize }, (_, i) => i + 1); // [1, 2, 3]
    const sumWeights = weights.reduce((a, b) => a + b, 0);

      // پیش‌بینی برای یک دوره آینده
    const lastWindow = values.slice(-windowSize);
      const predicted = lastWindow.reduce((sum, val, i) => sum + val * weights[i], 0) / sumWeights;
    wmaPredictions[tag] = Math.max(0, Math.round(predicted));
    });

    // --- مرحله ۴: ساخت داده‌های نمایشی ---
    const historical = result.map(item => {
    const periodLabel = period === "monthly"
        ? moment(item._id, "YYYY-MM").format("jYYYY/jMM")
        : `هفته ${item._id.split("-")[1]}`;

    return {
        period: periodLabel,
        tags: item.tags,
    };
    });

    const forecast = [];
    let lastPeriod = result[result.length - 1]._id;

    for (let i = 1; i <= forecast; i++) {
    const futurePeriod = addPeriod(lastPeriod, period, i);
    const futureLabel = period === "monthly"
        ? moment(futurePeriod, "YYYY-MM").format("jYYYY/jMM")
        : `هفته ${futurePeriod.split("-")[1]}`;

      // در پیش‌بینی پیشرفته، می‌تونیم از آخرین پیش‌بینی به عنوان ورودی بعدی استفاده کنیم
      const forecastedTags = { ...wmaPredictions }; // در این نسخه ساده، همیشه همین مقدار

    forecast.push({
        period: futureLabel,
        tags: forecastedTags
    });

    lastPeriod = futurePeriod;
    }

    return res.json({
    success: true,
    predictions: wmaPredictions,
    historical,
    forecast,
    topTags,
    });
} catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "خطای سرور" });
}
};

// تابع افزودن دوره
function addPeriod(period, type, months) {
const [year, month] = period.split("-");
const date = new Date(parseInt(year), parseInt(month) - 1);
date.setMonth(date.getMonth() + months);
return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}
exports.getTagTrends = async (req, res) => {
const { period = "monthly", topN = 5, limit = 12 } = req.query;
const adminId = req.admin._id;

try {
    // تعیین بازه زمانی
    let dateField, dateFormat;
    if (period === "weekly") {
    dateField = "week";
    dateFormat = "YYYY-[هفته ]W";
    } else {
    dateField = "month";
      dateFormat = "jYYYY/jMM"; // شمسی
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

    // تبدیل تاریخ به شمسی (اگر ماهانه)
    const trends = result.map(item => {
      const periodLabel = period === "monthly"
        ? moment(item._id, "YYYY-MM").format("jYYYY/jMM")
        : `هفته ${item._id.split("-")[1]}`;

      return {
        period: periodLabel,
        tags: item.tags,
      };
    });

    // استخراج topN تگ
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