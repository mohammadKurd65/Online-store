const AuditLog = require("../models/AuditLogModel");
const Notification = require("../models/NotificationModel");
const { sendNotificationToAdmin } = require("../utils/socketHandler");


const auditLogger = (action, entityType, description) => async (req, res, next) => {
const { user } = req;
const ip = req.ip;
const userAgent = req.headers["user-agent"];

try {
    // ذخیره لاگ
    await AuditLog.create({
    admin: user.id,
    action,
    entityType,
    entityId: req.params.id,
    description,
    ip,
    userAgent,
    });

    // ذخیره اعلان
    const newNotif = await Notification.create({
    admin: user.id,
    title: getNotificationTitle(action),
    message: description,
    type: getNotificationType(action),
    entityType,
    entityId: req.params.id,
    actionUrl: getActionUrl(action, entityType, req.params.id),
    });

    // ✅ ارسال اعلان زنده
    sendNotificationToAdmin(user.id, newNotif);
} catch (err) {
    console.error("خطا در ثبت لاگ و اعلان:", err);
}

next();
};

function getNotificationTitle(action) {
switch (action) {
    case "login":
    return "ورود";
    case "delete_user":
    return "حذف کاربر";
    case "create_product":
    return "محصول جدید";
    default:
    return "اعلان جدید";
}
}

function getNotificationType(action) {
switch (action) {
    case "delete_user":
    case "delete_product":
    return "danger";
    case "update_permissions":
    return "warning";
    case "create_product":
    return "success";
    default:
    return "info";
}
}

function getActionUrl(action, entityType, entityId) {
    // نمونه ساده: لینک به صفحه مدیریت همان موجودیت
    if (entityType === "user") return `/admin/users/${entityId}`;
    if (entityType === "product") return `/admin/products/${entityId}`;
    if (entityType === "order") return `/admin/orders/${entityId}`;
    return "/";
}

module.exports = auditLogger;