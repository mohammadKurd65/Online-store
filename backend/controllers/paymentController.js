// در بالای فایل
const axios = require("axios");
const Order = require("../models/OrderModel");

// درخواست پرداخت
exports.createPayment = async (req, res) => {
const { amount, products } = req.body;

try {
    // ذخیره سفارش با وضعیت pending
    const newOrder = new Order({
    products,
    amount,
    paymentStatus: "pending",
    });

    await newOrder.save();

    const callbackUrl = process.env.CALLBACK_URL || "http://localhost:3000/verify-payment";

    const response = await axios.post(
    "https://sandbox.zarinpal.com/pg/rest/WebGate.json", 
    {
        MerchantID: process.env.ZARINPAL_MERCHANT_ID,
        Amount: amount,
        CallbackURL: callbackUrl,
        Description: "خرید از علی‌بابا کلون",
    }
    );

    if (response.data.Status === 100) {
      // آپدیت Authority در دیتابیس
    newOrder.authority = response.data.Authority;
    await newOrder.save();

    return res.json({
        success: true,
        url: `https://sandbox.zarinpal.com/pg/StartPay/${response.data.Authority}`, 
        authority: response.data.Authority,
        orderId: newOrder._id,
    });
    } else {
    newOrder.paymentStatus = "failed";
    await newOrder.save();
    return res.status(400).json({ success: false, message: "خطا در درگاه" });
    }
} catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "خطای سرور" });
}
};

// تأیید پرداخت
exports.verifyPayment = async (req, res) => {
const { authority, amount, orderId } = req.body;

try {
    const response = await axios.post(
    "https://sandbox.zarinpal.com/pg/rest/WebGate.json", 
    {
        MerchantID: process.env.ZARINPAL_MERCHANT_ID,
        Amount: amount,
        Authority: authority,
    }
    );

    // پیدا کردن سفارش
    const order = await Order.findById(orderId);

    if (!order) {
    return res.status(404).json({ success: false, message: "سفارش یافت نشد" });
    }

    if (response.data.Status === 100) {
    order.paymentStatus = "paid";
    order.transactionId = response.data.RefID;
    await order.save();

    return res.json({
        success: true,
        ref_id: response.data.RefID,
    });
    } else {
    order.paymentStatus = "failed";
    await order.save();
    return res.status(400).json({ success: false, message: "پرداخت ناموفق" });
    }
} catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "خطای سرور" });
}
};