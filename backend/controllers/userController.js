const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");

// ورود کاربر
exports.loginUser = async (req, res) => {
const { username, password } = req.body;

try {
    const user = await User.findOne({ username });

    if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ success: false, message: "نام کاربری یا رمز اشتباه است." });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "1h",
    });

    return res.json({
    success: true,
    token,
    role: user.role,
    });
} catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "خطای سرور" });
}
};

// ثبت‌نام کاربر
exports.registerUser = async (req, res) => {
const { username, password } = req.body;

try {
    // چک کردن وجود کاربر
    const existingUser = await User.findOne({ username });
    if (existingUser) {
    return res.status(400).json({ success: false, message: "نام کاربری قبلاً استفاده شده." });
    }

    const newUser = new User({ username, password });
    await newUser.save();

    // ساخت JWT token
    const token = jwt.sign({ id: newUser._id, role: "user" }, process.env.JWT_SECRET, {
    expiresIn: "1h",
    });

    return res.json({
    success: true,
    token,
    });
} catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "خطای سرور" });
}
};

exports.getUserProfile = async (req, res) => {
const userId = req.user.id;

try {
    const user = await User.findById(userId).select("-password");

    if (!user) {
    return res.status(404).json({ success: false, message: "کاربر یافت نشد." });
    }

    return res.json({
    success: true,
    data: user,
    });
} catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "خطای سرور" });
}
};

// ویرایش پروفایل کاربر
exports.updateUserProfile = async (req, res) => {
const userId = req.user.id;
const { username, password } = req.body;

try {
    const updateData = {};
    if (username) updateData.username = username;
    if (password) updateData.password = password;

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
    new: true,
    runValidators: true,
    select: "-password",
    });

    return res.json({
    success: true,
    data: updatedUser,
    });
} catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "خطای سرور" });
}
};

// حذف حساب کاربر
exports.deleteUserProfile = async (req, res) => {
const userId = req.user.id;

try {
    await User.findByIdAndDelete(userId);

    return res.json({
    success: true,
    message: "حساب کاربری با موفقیت حذف شد.",
    });
} catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "خطای سرور" });
}
};