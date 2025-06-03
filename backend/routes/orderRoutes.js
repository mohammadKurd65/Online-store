const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");

// دریافت تمام سفارشات
router.get("/orders", orderController.getAllOrders);

// دریافت سفارش با ID
router.get("/orders/:id", orderController.getOrderById);

module.exports = router;