const Product = require("../models/productModel");

// گرفتن همه محصولات با فیلتر
exports.getAllProducts = async (req, res) => {
const { category, status, minPrice, maxPrice, inStock, page = 1, limit = 10 } = req.query;

try {
    let query = {};

    // فیلترها
    if (category) query.category = category;
    if (status) query.status = status;
    if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = parseInt(minPrice);
    if (maxPrice) query.price.$lte = parseInt(maxPrice);
    }
    if (inStock === "true") query.stock = { $gt: 0 };

    const skip = (parseInt(page) - 1) * limit;
    const products = await Product.find(query).skip(skip).limit(limit);
    const total = await Product.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    return res.json({
    success: true,
    data: products,
    pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages,
    },
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

exports.bulkDeleteProducts = async (req, res) => {
const { productIds } = req.body;

if (!Array.isArray(productIds) || productIds.length === 0) {
    return res.status(400).json({ success: false, message: "لطفاً حداقل یک محصول را انتخاب کنید." });
}

try {
    const result = await Product.deleteMany({ _id: { $in: productIds } });

    return res.json({
    success: true,
    message: `${result.deletedCount} محصول با موفقیت حذف شد.`,
    });
} catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "خطای سرور" });
}
};