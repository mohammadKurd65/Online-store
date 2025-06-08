
const Admin = require("../models/AdminModel");
const Order = require("../models/OrderModel");

// دریافت تمام سفارشات
exports.getAllOrders = async (req, res) => {
try {
    const orders = await Order.find().sort({ createdAt: -1 });
    return res.json({
    success: true,
    data: orders,
    });
} catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "خطای سرور" });
}
};

// دریافت سفارش با ID
exports.getOrderById = async (req, res) => {
const { id } = req.params;

try {
    const order = await Order.findById(id);

    if (!order) {
    return res.status(404).json({ success: false, message: "سفارش یافت نشد" });
    }

    return res.json({
    success: true,
    data: order,
    });
} catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "خطای سرور" });
}
};

// آپدیت وضعیت سفارشexports.updateOrderStatus = async (req, res) => {
exports.updateOrderStatus = async (req, res) => {
const { id } = req.params;
const { paymentStatus } = req.body;

try {
    const order = await Order.findByIdAndUpdate(
    id,
    { paymentStatus },
    { new: true }
    );

    if (!order) {
    return res.status(404).json({ success: false, message: "سفارش یافت نشد." });
    }

    return res.json({
    success: true,
    data: order,
    });
} catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "خطای سرور" });
}
};

// اضافه کردن ادمین جدید
exports.createAdmin = async (req, res) => {
const { username, password } = req.body;

try {
    // چک کردن وجود نام کاربری تکراری
    const existingAdmin = await Admin.findOne({ username });
    if (existingAdmin) {
    return res.status(400).json({ success: false, message: "نام کاربری قبلاً استفاده شده" });
    }

    const newAdmin = new Admin({ username, password });
    await newAdmin.save();

    return res.status(201).json({
    success: true,
    data: {
        _id: newAdmin._id,
        username: newAdmin.username,
    },
    });
} catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "خطای سرور" });
}
};

exports.getUserOrders = async (req, res) => {
const { status, startDate, endDate } = req.query;
const userId = req.user.id;

try {
    let query = { user: userId };
    
    if (status) {
    query.paymentStatus = status;
    }

    if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) query.createdAt.$gte = new Date(startDate);
    if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const orders = await Order.find(query).sort({ createdAt: -1 });
    return res.json({
    success: true,
    data: orders,
    });
} catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "خطای سرور" });
}
};

// حذف سفارش
exports.deleteOrder = async (req, res) => {
const { id } = req.params;

try {
    const order = await Order.findByIdAndDelete(id);

    if (!order) {
    return res.status(404).json({ success: false, message: "سفارش یافت نشد." });
    }

    return res.json({
    success: true,
    message: "سفارش با موفقیت حذف شد.",
    });
} catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "خطای سرور" });
}
};

// حذف سفارش کاربر (فقط اگر مال خودش باشه)
exports.deleteUserOrder = async (req, res) => {
const { id } = req.params;
  const userId = req.user.id; // آیدی کاربر از توکن

try {
    const order = await Order.findById(id);

    if (!order) {
    return res.status(404).json({ success: false, message: "سفارش یافت نشد." });
    }

    // چک کردن اینکه آیا این سفارش متعلق به این کاربر هست؟
    if (order.user.toString() !== userId) {
    return res.status(403).json({ success: false, message: "دسترسی غیرمجاز" });
    }

    await Order.findByIdAndDelete(id);

    return res.json({
    success: true,
    message: "سفارش شما با موفقیت حذف شد.",
    });
} catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "خطای سرور" });
}
};