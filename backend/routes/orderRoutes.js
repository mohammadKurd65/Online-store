const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");

// ایمپورت صحیح توابع به صورت جداگانه
const {
createOrder,
getAllOrders,
getOrderById,
updateOrderStatus,
deleteOrder,
getOrdersByUserId,
getOrdersByStatus,
getOrdersByDateRange,
getTotalSales,
getTotalSalesByDateRange,
getTotalSalesByUser,
getTotalSalesByProduct,
getTotalSalesByCategory,
getTotalSalesByPaymentMethod,
getTotalSalesByStatus,
getTotalSalesByDate,
getTotalSalesByMonth,
getTotalSalesByYear,
getTotalSalesByWeek,
getTotalSalesByHour,
getTotalSalesByMinute,
getTotalSalesBySecond,
getTotalSalesByDay,
getUserOrders,
getUserOrderById,
deleteUserOrder
} = require("../controllers/orderController");

// ایمپورت میدلورها
const authAdmin = require("../middleware/authMiddleware");
const authMiddleware = require("../middleware/authMiddleware");

// Create a new order
router.post("/orders", createOrder);

// Get all orders (Admin only)
router.get("/orders", authAdmin, getAllOrders);

// Get order by ID (Admin only)
router.get("/orders/:id", authAdmin, getOrderById);

// Update order status (Admin only)
router.put("/orders/:id/status", authAdmin, updateOrderStatus);

// Delete an order (Admin only)
router.delete("/orders/:id", authAdmin, deleteOrder);


// User specific routes
router.get("/user/orders", authMiddleware, orderController.getUserOrders);
router.get("/user/orders/:id", authMiddleware, orderController.getUserOrderById);
router.delete("/user/orders/:id", authMiddleware, orderController.deleteUserOrder);
module.exports = router;