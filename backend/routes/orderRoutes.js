const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const authAdmin = require("../middleware/authMiddleware");
const OrderModel = require("../models/OrderModel");

// order routes


// Create a new order
router.post("/orders", OrderModel.createOrdrer);
// Get all orders
// Get order by ID
//این مسیر فقط برای ادمین های فعال است
//این مسیر فقط برای ادمین های فعال در دسترس است


// فقط ادمین‌ها می‌تونن دسترسی داشته باشن
router.get("/orders", authAdmin, orderController.getAllOrders);
router.get("/orders/:id", authAdmin, orderController.getOrderById);
// Update order status
router.put("/orders/:id/status", authAdmin, orderController.updateOrderStatus);
// Delete an order
router.delete("/orders/:id", authAdmin, orderController.deleteOrder);
// Get orders by user Id
router.get("/orders/user/:userId", authAdmin, orderController.getOrdersByUserId);
// Get orders by status
router.get("/orders/status/:status", authAdmin, orderController.getOrdersByStatus);
// Get orders by date range
router.get("/orders/date", authAdmin, orderController.getOrdersByDateRange);
// Get total sales
router.get("/orders/sales", authAdmin, orderController.getTotalSales);
// Get total sales by date range
router.get("/orders/sales/date", authAdmin, orderController.getTotalSalesByDateRange);
// Get total sales by user
router.get("/orders/sales/user/:userId", authAdmin, orderController.getTotalSalesByUser);
// Get total sales by product
router.get("/orders/sales/product/:productId", authAdmin, orderController.getTotalSalesByProduct);
// Get total sales by category
router.get("/orders/sales/category/:categoryId", authAdmin, orderController.getTotalSalesByCategory);
// Get total sales by payment method
router.get("/orders/sales/payment/:paymentMethod", authAdmin, orderController.getTotalSalesByPaymentMethod);
// Get total sales by status
router.get("orders/sales/status/:status", authAdmin, orderController.getTotalSalesByStatus);
// Get total sales by date
router.get("/orders/sales/data/:date", authAdmin, orderController.getTotalSalesByDate);
// Get total sales by month
router.get("/orders/sales/month/:month", authAdmin, orderController.getTotalSalesByMonth);
// Get total sales by year
router.get("orders/sales/year/:year", authAdmin, orderController.getTotalSalesByYear);
// Get total sales by week
router.get("orders/sales/week/:week", authAdmin, orderController.getTotalSalesByWeek);
// Get total sales by hour
router.get("orders/sales/hour/:hour", authAdmin, orderController.getTotalSalesByHour);
// Get total sales by minute
router.get("orders/sales/minute/:minute", authAdmin, orderController.getTotalSalesByMinute);
// Get total sales by second
router.get("orders/sales/second/:second", authAdmin, orderController.getTotalSalesBySecond);
// Get total sales by day
router.get("orders/sales/day/:day", authAdmin, orderController.getTotalSalesByDay);



module.exports = router;