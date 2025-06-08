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

    const token = jwt.sign({ id: user._id, role: "user" }, process.env.JWT_SECRET, {
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