const jwt = require("jsonwebtoken");

const authAdmin = (req, res, next) => {
const token = req.headers["authorization"]?.split(" ")[1];

if (!token) {
    return res.status(401).json({ success: false, message: "دسترسی رد شد، توکن وجود ندارد." });
}

try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = decoded;
    next();
} catch (err) {
    return res.status(401).json({ success: false, message: "توکن نامعتبر یا منقضی شده است." });
}
};

module.exports = authAdmin;