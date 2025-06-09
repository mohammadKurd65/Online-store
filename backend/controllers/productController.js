const Product = require("../models/productModel");

// گرفتن همه محصولات با فیلتر
exports.getAllProducts = async (req, res) => {
try {
    const products = await Product.find().sort({ createdAt: -1 });
    return res.json({
    success: true,
    data: products,
    });
} catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "خطای سرور" });
}
};
// گرفتن محصول بر اساس آیدی


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

exports.getProductById = async (req, res) => {
const { id } = req.params;

try {
    const product = await Product.findById(id);
    if (!product) {
    return res.status(404).json({ success: false, message: "محصول یافت نشد." });
    }

    return res.json({
    success: true,
    data: product,
    });
} catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "خطای سرور" });
}
};

exports.updateProductById = async (req, res) => {
const { id } = req.params;
const updateData = req.body;

try {
    // اگر تصویر جدید آپلود شده بود، URL رو آپدیت کن
    if (req.file) {
    updateData.image = `/images/${req.file.filename}`;
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
    });

    if (!updatedProduct) {
    return res.status(404).json({ success: false, message: "محصول یافت نشد." });
    }

    return res.json({
    success: true,
    data: updatedProduct,
    });
} catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "خطای سرور" });
}
};
exports.deleteProductById = async (req, res) => {
const { id } = req.params;

try {
    const product = await Product.findByIdAndDelete(id);

    if (!product) {
    return res.status(404).json({ success: false, message: "محصول یافت نشد." });
    }

    return res.json({
    success: true,
    message: "محصول با موفقیت حذف شد.",
    });
} catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "خطای سرور" });
}
};