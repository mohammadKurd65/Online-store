// const axios = require("axios");
// const Order = require("../models/OrderModel");
const product = require("../models/productModel");




exports.getAllProducts = async (req, res) => {
const { category, price, inStock, status } = req.query;

try {
    let query = {};

    // فیلتر دسته‌بندی
    if (category) query.category = category;

    // فیلتر قیمت
    if (price) {
    const [min, max] = price.split("-");
    if (min && max) {
        query.price = { $gte: parseInt(min), $lte: parseInt(max) };
    } else if (min) {
        query.price = { $gte: parseInt(min) };
    }
    }

    // فقط محصولات موجود
    if (inStock === "true") {
    query.stock = { $gt: 0 };
    }

    // فیلتر وضعیت
    if (status) {
    query.status = status;
    }

    const products = await Product.find(query).limit(20); // حداکثر ۲۰ تا محصول
    return res.json({
    success: true,
    data: products,
    });
} catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "خطای سرور" });
}
};