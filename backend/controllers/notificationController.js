const Notification = require("../models/NotificationModel");

exports.getNotifications = async (req, res) => {
try {
    const notifications = await Notification.find({ user: req.admin._id })
    .sort({ createdAt: -1 })
    .limit(50);

    return res.json({
    success: true,
    data: notifications,
    unreadCount: notifications.filter(n => !n.read).length,
    });
} catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "خطای سرور" });
}
};

exports.markAsRead = async (req, res) => {
const { id } = req.body;
try {
    await Notification.findOneAndUpdate(
    { _id: id, user: req.admin._id },
    { read: true }
    );
    return res.json({ success: true, message: "علامت‌گذاری شد." });
 } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "خطای سرور" });
}
};

exports.markAllAsRead = async (req, res) => {
try {
    await Notification.updateMany(
    { user: req.admin._id, read: false },
    { read: true }
    );
    return res.json({ success: true, message: "همه علامت‌گذاری شدند." });
} catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "خطای سرور" });
}
};