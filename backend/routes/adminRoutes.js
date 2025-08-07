const express = require("express");
const router = express.Router();
const Order = require("../models/OrderModel");
const User = require("../models/UserModel");
// const Product = require("../models/ProductModel");
const moment = require("moment-jalaali");
moment.locale("fa");

// تابع مستقیم در فایل routes
const getAdminDashboardStats = async (req, res) => {
try {
    const totalOrders = await Order.countDocuments();
    const totalUsers = await User.countDocuments();
    
    return res.json({
    success: true,
    data: {
        orders: { total: totalOrders },
        users: { total: totalUsers }
    }
    });
} catch (error) {
    return res.status(500).json({
    success: false,
    message: "خطا",
    error: error.message
    });
}
};

// استفاده مستقیم از تابع
router.get("/dashboard/stats", getAdminDashboardStats);

console.log("Admin Routes created successfully");
module.exports = { default: router };