const PersistentNotificationLog = require("../models/PersistentNotificationLogModel");

const persistentLogger = (action, description = "") => async (req, res, next) => {
try {
    const { user } = req; // اطلاعات ادمین از authMiddleware
    const ip = req.ip;
    const userAgent = req.headers["user-agent"];

    let logData = {
    admin: user.id,
    action,
    ip,
    userAgent,
    description,
    };

    if (req.params.id) {
    logData.notificationId = req.params.id;
    }

    // ذخیره داده قبلی (برای update/delete)
    if (action === "update" && req.previousData) {
    logData.previousData = req.previousData;
    logData.newData = {
        title: req.body.title,
        message: req.body.message,
        type: req.body.type,
        active: req.body.active,
    };
    }

    await PersistentNotificationLog.create(logData);
} catch (err) {
    console.error("خطا در ثبت لاگ اعلان دائمی:", err);
}

next();
};

module.exports = persistentLogger;