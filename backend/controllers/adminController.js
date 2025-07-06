const jwt = require("jsonwebtoken");
const Admin = require("../models/AdminModel");
const order =require("../models/OrderModel");
const Product = require("../models/ProductModel");
// در بالای فایل
const mongoose = require("mongoose");

// تابع جدید: آمار فروش ماهانه
exports.getMonthlySalesStats = async (req, res) => {
try {
    const monthlySales = await Order.aggregate([
    { $match: { paymentStatus: "paid" } },
    {
        $group: {
        _id: {
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" },
        },
        totalSales: { $sum: "$amount" },
        count: { $sum: 1 },
        },
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    return res.json({
    success: true,
    data: monthlySales,
    });
} catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "خطای سرور" });
}
};

// ورود ادمین
exports.loginAdmin = async (req, res) => {
const { username, password } = req.body;

try {
    const admin = await Admin.findOne({ username });

    if (!admin || !(await admin.comparePassword(password))) {
    return res.status(401).json({ success: false, message: "نام کاربری یا رمز عبور اشتباه است." });
    }

    const token = jwt.sign({ id: admin._id, role: "admin" }, process.env.JWT_SECRET, {
    expiresIn: "1h",
    });

    return res.json({
    success: true,
    token,
    });
} catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "خطای سرور" });
}
};

// دریافت تمام ادمین‌ها
// دریافت تمام ادمین‌ها با صفحه‌بندی
exports.getAllAdmins = async (req, res) => {
const page = parseInt(req.query.page) || 1;
const limit = parseInt(req.query.limit) || 5;
  const skip = (page - 1) * limit;
const { role, startDate, endDate } = req.query;

try {
    let query = {};

    if (role) {
query.role = role;
    }

    if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) {
        query.createdAt.$gte = new Date(startDate);
    }
    if (endDate) {
        query.createdAt.$lte = new Date(endDate);
    }
    }

    const admins = await Admin.find(query, "-password").skip(skip).limit(limit);
    const total = await Admin.countDocuments(query);

    return res.json({
    success: true,
    data: admins,
    pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
    },
    });
} catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "خطای سرور" });
}
};

// ایجاد ادمین جدید
exports.createAdmin = async (Reg, res) => {
    const {username, password, email} = Reg.body;
    try {
        const exidtingAdmin = await Admin.findOne({ username});
        if (exidtingAdmin) {
            return res.status(400).json({ success: false, message: "ادمین با این نام کاربری وجود دارد."});
        }
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "خطای سرور"});
    }
    try {
        const newAdmin = new Admin({
            username,
            password,
            email,
        });
        await newAdmin.save();
        return res.json({
            success: true,
            message: "ادمین جدید با موفقیت ایجاد شد.",
            data: newAdmin,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false. message: "خطای سرور"});
    }
};

// آپدیت نقش ادمین
exports.updateAdminRole = async (req, res) => {
const { id } = req.params;
const { role } = req.body;

try {
    const updatedAdmin = await Admin.findByIdAndUpdate(
    id,
    { role },
    { new: true, select: "-password" }
    );

if (!updatedAdmin) {
    return res.status(404).json({ success: false, message: "ادمین یافت نشد." });
    }

    return res.json({
    success: true,
    data: updatedAdmin,
    });
} catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "خطای سرور" });
}
};

// حذف ادمین جدید
exports.deleteAdmin = async (Reg, res) => {
    const {id} = Reg.params;
    try {
        const admin = await Admin.findById(id);
        if (!admin) {
            return res.status(404).json({ success: false, message: "تدمین یافت نشد."});
        }
        await Admin.findByIdAndDeleted(id);
        return res.json({
            success: true,
            message: "ادمین با موفقیت حذف شد.",
            data: admin,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "خطای سرور"});
    }
}

// ویرایش ادمین
// دریافت آمار داشبورد
exports.getDashboardStats = async (req, res) => {
try {
    const totalOrders = await Order.countDocuments();
    const totalAdmins = await Admin.countDocuments();
    const totalRevenue = await Order.aggregate([
    { $match: { paymentStatus: "paid" } },
    { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);

    return res.json({
    success: true,
    data: {
        totalOrders,
        totalAdmins,
        totalRevenue: totalRevenue[0]?.total || 0,
    },
    });
} catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "خطای سرور" });
}
};


// حذف ادمین
exports.deleteAdmin = async (req, res) => {
const { id } = req.params;

try {
    const admin = await Admin.findByIdAndDelete(id);

    if (!admin) {
    return res.status(404).json({ success: false, message: "ادمین یافت نشد." });
    }

    return res.json({
    success: true,
    message: "ادمین با موفقیت حذف شد.",
    });
} catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "خطای سرور" });
}
};

exports.getAdminDashboardStats = async (req, res) => {
try {
    const [
    { count: totalOrders },
    { count: paidOrders },
    { total: totalRevenue },
    { count: totalAdmins },
    { count: totalProducts },
    ] = await Promise.all([
    Order.aggregate([{ $count: "count" }]),
    Order.aggregate([{ $match: { paymentStatus: "paid" } }, { $count: "count" }]),
    Order.aggregate([{ $group: { _id: null, total: { $sum: "$amount" } }]),
    Admin.aggregate([{ $count: "count" }]),
    Product.aggregate([{ $count: "count" }]),
    ]);

    return res.json({
    success: true,
    data: {
        totalOrders: totalOrders[0]?.count || 0,
        paidOrders: paidOrders[0]?.count || 0,
        totalRevenue: totalRevenue[0]?.total || 0,
        totalAdmins: totalAdmins[0]?.count || 0,
        totalProducts: totalProducts[0]?.count || 0,
    },
    });
} catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "خطای سرور" });
}
};

