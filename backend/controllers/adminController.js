const jwt = require("jsonwebtoken");
const Admin = require("../models/AdminModel");
const Order = require("../models/OrderModel");
const Product = require("../models/ProductModel");
const mongoose = require("mongoose");
const User = require("../models/UserModel");

// حذف کاربر
exports.deleteUser = async (req, res) => {
const { id } = req.params;
try {
    await User.findByIdAndDelete(id);
    return res.json({
    success: true,
    message: "کاربر با موفقیت حذف شد.",
    });
} catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "خطای سرور" });
}
};

// ساخت کاربر جدید
exports.createUser = async (req, res) => {
const { username, password, role, status } = req.body;
try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
    return res.status(400).json({ success: false, message: "نام کاربری قبلاً استفاده شده." });
    }
    const newUser = new User({ username, password, role, status });
    await newUser.save();
    return res.status(201).json({
    success: true,
    data: {
        _id: newUser._id,
        username: newUser.username,
        role: newUser.role,
        status: newUser.status,
    },
    });
} catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "خطای سرور" });
}
};

// ذخیره تنظیمات داشبورد
exports.saveDashboardSettings = async (req, res) => {
const { settings } = req.body;
const userId = req.user.id;
try {
    await Admin.findByIdAndUpdate(userId, { dashboardSettings: settings });
    return res.json({ success: true, message: "تنظیمات ذخیره شد." });
} catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "خطای سرور" });
}
};

// دریافت آمار داشبورد
exports.getDashboardStats = async (req, res) => {
try {
    const [
    totalUsers,
    activeUsers,
    totalProducts,
    totalRevenue,
    paidOrders,
    ] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ status: "active" }),
    Product.countDocuments(),
    Order.aggregate([{ $group: { _id: null, total: { $sum: "$amount" } } }]),
    Order.countDocuments({ paymentStatus: "paid" }),
    ]);
    return res.json({
    success: true,
    data: {
        totalUsers,
        activeUsers,
        totalProducts,
        totalRevenue: totalRevenue[0]?.total || 0,
        paidOrders,
    },
    });
} catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "خطای سرور" });
}
};

// دریافت همه کاربران با فیلتر و صفحه‌بندی
exports.getAllUsers = async (req, res) => {
const { role, status, startDate, endDate, search, page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;
try {
    let query = {};
    if (search) query.username = { $regex: search, $options: "i" };
    if (role) query.role = role;
    if (status) query.status = status;
    if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) query.createdAt.$gte = new Date(startDate);
    if (endDate) query.createdAt.$lte = new Date(endDate);
    }
    const users = await User.find(query, "-password").skip(skip).limit(limit);
    const total = await User.countDocuments(query);
    return res.json({
    success: true,
    users,
    pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / limit),
    },
    });
} catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "خطای سرور" });
}
};

// دریافت کاربر با آیدی
exports.getUserById = async (req, res) => {
const { id } = req.params;
try {
    const user = await User.findById(id, "-password");
    if (!user) {
    return res.status(404).json({ success: false, message: "کاربر یافت نشد." });
    }
    return res.json({
    success: true,
    data: user,
    });
} catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "خطای سرور" });
}
};

// آپدیت کاربر
exports.updateUser = async (req, res) => {
const { id } = req.params;
const updateData = req.body;
try {
    const updatedUser = await User.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
    });
    return res.json({
    success: true,
    data: updatedUser,
    });
} catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "خطای سرور" });
}
};

// حذف محصول
exports.deleteProduct = async (req, res) => {
    const { id} = req.params;
    try {
        const product = await product.findByIdAndDelete(id);
        if(!product) {
            return res.status(404).json({ success: false, message: "محصول یافت نشد."});
            
        }
        return res.json({ success: true, message: "محصول با موفقیت حذف شد."});
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "خطای سرور" });
    }
}
