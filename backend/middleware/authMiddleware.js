const jwt = require("jsonwebtoken");

const authMiddleware = (allowedRoles = ["user", "editor", "admin"]) => {
return (req, res, next) => {
    const token = req.headers["authorization"]?.split(" ")[1];

    if (!token) {
    return res.status(401).json({ success: false, message: "توکن وجود ندارد." });
    }

    try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

      // چک کردن نقش
    if (!allowedRoles.includes(decoded.role)) {
        return res.status(403).json({ success: false, message: "دسترسی غیرمجاز" });
    }

    next();
    } catch (err) {
    return res.status(401).json({ success: false, message: "توکن نامعتبر یا منقضی شده." });
    }
};
};

module.exports = authMiddleware;