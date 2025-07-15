const AuditLog = require("../models/AuditLogModel");

const auditLogger = (action, entityType, description) => async (req, res, next) => {
try {
    const { user } = req; // اطلاعات ادمین از authMiddleware
    const ip = req.ip;
    const userAgent = req.headers["user-agent"];
    const actionLabels = {
login: "ورود به داشبورد",
logout: "خروج از داشبورد",
delete_user: "حذف کاربر",
update_permissions: "ویرایش دسترسی‌ها",
create_product: "افزودن محصول",
delete_product: "حذف محصول",
edit_profile: "ویرایش پروفایل",
manage_orders: "مدیریت سفارشات",
};
    await AuditLog.create({
    admin: user.id,
    action,
    entityType,
      entityId: req.params.id, // اگر ID وجود داشت توی route
    description,
    ip,
    userAgent,
    });
} catch (err) {
    console.error("خطا در ذخیره لاگ:", err);
}

next();
};


module.exports = auditLogger;