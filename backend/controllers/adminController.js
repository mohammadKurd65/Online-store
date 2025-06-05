const jwt = require("jsonwebtoken");
const Admin = require("../models/AdminModel");

exports.loginAdmin = async (req, res) => {
const { username, password } = req.body;

try {
    const admin = await Admin.findOne({ username });

    if (!admin || !(await admin.comparePassword(password))) {
    return res.status(401).json({ success: false, message: "نام کاربری یا رمز عبور اشتباه است." });
    }

    // ساخت JWT token
    const token = jwt.sign({ id: admin._id, role: "admin" }, process.env.JWT_SECRET, {
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