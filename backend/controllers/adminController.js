const Order = require("../models/OrderModel");
const User = require("../models/UserModel");
const Product = require("../models/ProductModel");
const moment = require("moment-jalaali");
moment.locale("fa");

// تابع اصلی آمار داشبورد
const getAdminDashboardStats = async (req, res) => {
try {
    // آمار ساده برای تست سریع
    const totalOrders = await Order.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    
    return res.json({
    success: true,
    data: {
        orders: {
        total: totalOrders,
        today: 0,
        weekly: 0
        },
        users: {
        total: totalUsers,
        newToday: 0
        },
        products: {
        total: totalProducts,
        outOfStock: 0
        }
    }
    });
} catch (error) {
    console.error("Error:", error);
    return res.status(500).json({
    success: false,
    message: "خطای سرور",
    error: error.message
    });
}
};

// ✅ راه‌حل قطعی اکسپورت
module.exports = {
getAdminDashboardStats: getAdminDashboardStats
};