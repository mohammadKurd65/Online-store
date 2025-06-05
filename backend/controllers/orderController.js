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

// آپدیت وضعیت سفارش
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