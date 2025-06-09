const Product = require("../models/productModel");

// گرفتن همه محصولات با فیلتر
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

// ساخت محصول جدید
exports.createProduct = async (req, res) => {
const {
    name,
    description,
    price,
    category,
    stock,
    status,
    image,
} = req.body;

  // اعتبارسنجی ساده
if (!name || !price || !category) {
    return res.status(400).json({ success: false, message: "نام، قیمت و دسته‌بندی الزامی است." });
}

try {
    const newProduct = new Product({
    name,
    description,
    price,
    category,
    image,
    stock,
    status,
      user: req.admin?.id, // اگر middleware احراز هویت دارید
    });

    await newProduct.save();

    return res.status(201).json({
    success: true,
    data: newProduct,
    });
} catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "خطای سرور" });
}
};