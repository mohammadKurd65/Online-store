const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");

router.post("/request", paymentController.createPayment);
router.post("/verify", paymentController.verifyPayment);

module.exports = router;