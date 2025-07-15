const AuditLog = require("../models/AuditLogModel");
const Notification = require("../models/NotificationModel");

const auditLogger = (action, entityType, description) => async (req, res, next) => {
  const { user } = req; // اطلاعات ادمین از authMiddleware
const ip = req.ip;
const userAgent = req.headers["user-agent"];

try {
    // ثبت لاگ
    await AuditLog.create({
    admin: user.id,
    action,
    entityType,
    entityId: req.params.id,
    description,
    ip,
    userAgent,
    });

    // ثبت اعلان
    await Notification.create({
    admin: user.id,
    title: "عملیات جدید",
    message: description,
    type: getNotificationType(action),
    actionUrl: getActionUrl(action, entityType, req.params.id),
    entityType,
    entityId: req.params.id,
    });
} catch (err) {
    console.error("خطا در ثبت لاگ و اعلان:", err);
}

next();
};

// تعیین نوع اعلان
function getNotificationType(action) {
switch (action) {
    case "delete_user":
    case "delete_product":
    return "danger";
    case "login":
    case "logout":
    return "info";
    case "update_permissions":
    case "edit_settings":
    return "warning";
    case "create_product":
    case "create_user":
    return "success";
    default:
    return "info";
}
}

// تعیین لینک اعلان
function getActionUrl(action, entityType, entityId) {
if (!entityId) return "/admin/dashboard";

switch (entityType) {
    case "user":
    return `/admin/users/${entityId}`;
    case "product":
    return `/admin/products/${entityId}`;
    case "order":
    return `/admin/orders/${entityId}`;
    case "role":
    return "/admin/permissions";
    case "settings":
    return "/admin/settings";
    default:
    return "/";
}
}

module.exports = auditLogger;