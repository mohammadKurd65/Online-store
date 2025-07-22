const jwt = require("jsonwebtoken");
const Admin = require("../models/AdminModel");
const Order = require("../models/OrderModel");
const Product = require("../models/ProductModel");
const mongoose = require("mongoose");
const User = require("../models/UserModel");
const AdminRole = require("../models/AdminRoleModel");
const AuditLog = require("../models/AuditLogModel");
const Notification = require("../models/NotificationModel");
const { sendNotificationToAdmin } = require("../utils/socketHandler");
const { broadcastGlobalNotification } = require("../utils/socketHandler");
const GlobalNotification = require("../models/GlobalNotificationModel");
const PersistentNotification =  require("../models/persistentNotificationModel");


exports.getNotifications = async (req, res) => {
const adminId = req.admin._id;

try {
    const notifications = await Notification.find({ admin: adminId }).sort({
    createdAt: -1,
    });

    return res.json({
    success: true,
    notifications,
    });
} catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "خطای سرور" });
}
};

exports.markAsRead = async (req, res) => {
const { id } = req.params;
try {
    await Notification.findByIdAndUpdate(id, { read: true });
    return res.json({
    success: true,
    message: "اعلان با موفقیت خوانده شد.",
    });
} catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "خطای سرور" });
}
};

exports.markAllAsRead = async (req, res) => {
const adminId = req.admin._id;

try {
    await Notification.updateMany({ admin: adminId, read: false }, { read: true });
    return res.json({
    success: true,
    message: "همه اعلان‌ها خوانده شدند.",
    });
} catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "خطای سرور" });
}
};
// حذف کاربر
exports.deleteUser = async (req, res) => {
const { id } = req.params;

try {
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
    return res.status(404).json({ success: false, message: "کاربر یافت نشد." });
    }

    return res.json({
    success: true,
    message: "کاربر با موفقیت حذف شد.",
    });
} catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "خطای سرور" });
}
};

// ساخت کاربر جدید
exports.createUser = async (req, res) => {
const { username, password, role, status } = req.body;
try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
    return res.status(400).json({ success: false, message: "نام کاربری قبلاً استفاده شده." });
    }
    const newUser = new User({ username, password, role, status });
    await newUser.save();
    return res.status(201).json({
    success: true,
    data: {
        _id: newUser._id,
        username: newUser.username,
        role: newUser.role,
        status: newUser.status,
    },
    });
} catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "خطای سرور" });
}
};

// ذخیره تنظیمات داشبورد
exports.saveDashboardSettings = async (req, res) => {
const { settings } = req.body;
const userId = req.user.id;
try {
    await Admin.findByIdAndUpdate(userId, { dashboardSettings: settings });
    return res.json({ success: true, message: "تنظیمات ذخیره شد." });
} catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "خطای سرور" });
}
};

// دریافت آمار داشبورد
exports.getDashboardStats = async (req, res) => {
try {
    const [
    totalUsers,
    activeUsers,
    totalProducts,
    totalRevenue,
    paidOrders,
    ] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ status: "active" }),
    Product.countDocuments(),
    Order.aggregate([{ $group: { _id: null, total: { $sum: "$amount" } } }]),
    Order.countDocuments({ paymentStatus: "paid" }),
    ]);
    return res.json({
    success: true,
    data: {
        totalUsers,
        activeUsers,
        totalProducts,
        totalRevenue: totalRevenue[0]?.total || 0,
        paidOrders,
    },
    });
} catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "خطای سرور" });
}
};

// دریافت همه کاربران با فیلتر و صفحه‌بندی
exports.getAllUsers = async (req, res) => {
const { role, status, startDate, endDate, search, page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;
try {
    let query = {};
    if (search) query.username = { $regex: search, $options: "i" };
    if (role) query.role = role;
    if (status) query.status = status;
    if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) query.createdAt.$gte = new Date(startDate);
    if (endDate) query.createdAt.$lte = new Date(endDate);
    }
    const users = await User.find(query, "-password").skip(skip).limit(limit);
    const total = await User.countDocuments(query);
    return res.json({
    success: true,
    users,
    pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / limit),
    },
    });
} catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "خطای سرور" });
}
};

// دریافت کاربر با آیدی
exports.getUserById = async (req, res) => {
const { id } = req.params;
try {
    const user = await User.findById(id, "-password");
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

// آپدیت کاربر
exports.updateUser = async (req, res) => {
const { id } = req.params;
const updateData = req.body;
try {
    const updatedUser = await User.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
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

// حذف محصول
exports.deleteProduct = async (req, res) => {
    const { id} = req.params;
    try {
        const product = await product.findByIdAndDelete(id);
        if(!product) {
            return res.status(404).json({ success: false, message: "محصول یافت نشد."});
            
        }
        return res.json({ success: true, message: "محصول با موفقیت حذف شد."});
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "خطای سرور" });
    }
}

exports.saveDashboardLayout = async (req, res) => {
const { layout } = req.body;
const userId = req.user.id;

try {
    await Admin.findByIdAndUpdate(userId, { dashboardLayout: layout });
    return res.json({ success: true, message: "آرایش داشبورد ذخیره شد." });
} catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "خطای سرور" });
}
};

exports.getAllRoles = async (req, res) => {
try {
    const roles = await AdminRole.find(); // یا اگر مستقل بود، UserRole
    return res.json({
    success: true,
    roles,
    });
} catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "خطای سرور" });
}
};

exports.updateRolePermissions = async (req, res) => {
const { role } = req.params;
const { permissions } = req.body;

try {
    await AdminRole.findOneAndUpdate({ name: role }, { permissions });
    return res.json({
    success: true,
    message: "دسترسی‌ها با موفقیت آپدیت شد.",
    });
} catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "خطای سرور" });
}
};

exports.getRolePermissions = async (req, res) => {
try {
    const role = await AdminRole.findOne({ name: req.user.role }).select("permissions");
    if (!role) {
    return res.status(404).json({ success: false, message: "نقش یافت نشد." });
    }

    return res.json({
    success: true,
    permissions: role.permissions,
    });
} catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "خطای سرور" });
}
};

exports.getAuditLogs = async (req, res) => {
try {
    const logs = await AuditLog.find()
    .populate("admin", "username")
    .sort({ createdAt: -1 });

    return res.json({
    success: true,
    logs,
    });
} catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "خطای سرور" });
}
};

exports.getNotificationSettings = async (req, res) => {
const adminId = req.admin._id;

try {
    const settings = await Admin.findById(adminId).select("notificationSettings");

    return res.json({
    success: true,
    settings: settings.notificationSettings || {},
    });
} catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "خطای سرور" });
}
};

exports.saveNotificationSettings = async (req, res) => {
const adminId = req.admin._id;
const { settings } = req.body;

try {
    await Admin.findByIdAndUpdate(
    adminId,
    { notificationSettings: settings },
    { new: true }
    );

    return res.json({
    success: true,
    message: "تنظیمات با موفقیت ذخیره شد.",
    });
} catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "خطای سرور" });
}
};

exports.broadcastNotification = async (req, res) => {
const { title, message, type, recipient, adminId } = req.body;

try {
    let notificationData = {
    title,
    message,
    type,
    actionUrl: "/admin/dashboard",
    };

    if (recipient === "all") {
      // ارسال به همه ادمین‌ها
    const admins = await Admin.find({}, "_id");

    for (const admin of admins) {
        const notification = new Notification({
        ...notificationData,
        admin: admin._id,
        });
        await notification.save();
        sendNotificationToAdmin(admin._id, notification);
    }

    return res.json({
        success: true,
        message: "اعلان به تمام ادمین‌ها ارسال شد.",
    });
    } else if (recipient === "specific" && adminId) {
    const notification = new Notification({
        ...notificationData,
        admin: adminId,
    });
    await notification.save();
    sendNotificationToAdmin(adminId, notification);

    return res.json({
        success: true,
        message: "اعلان به ادمین خاص ارسال شد.",
    });
    }

    return res.status(400).json({ success: false, message: "دریافت کننده نامعتبر." });
} catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "خطای سرور" });
}
};



exports.sendGlobalNotification = async (req, res) => {
const { title, message, type, audience } = req.body;

try {
    const notif = {
    title,
    message,
    type,
    isGlobal: true,
    audience,
    createdAt: new Date(),
    };

    // ذخیره در لاگ
    await GlobalNotification.create(notif);

    // ✅ ارسال زنده
    broadcastGlobalNotification(notif);

    return res.json({
    success: true,
    message: "اعلان عمومی ارسال شد.",
    });
} catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "خطای سرور" });
}
};



exports.getGlobalNotifications = async (req, res) => {
try {
    const notifications = await GlobalNotification.find().sort({ createdAt: -1 });
    return res.json({
    success: true,
    data: notifications,
    });
} catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "خطای سرور" });
}
};

exports.deletePersistentNotification = async (req, res) => {
const { id } = req.params;

try {
    await PersistentNotification.findByIdAndDelete(id);
    return res.json({
    success: true,
    message: "اعلان با موفقیت حذف شد.",
    });
} catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "خطای سرور" });
}
};