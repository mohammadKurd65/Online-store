const jwt = require("jsonwebtoken");
const Admin = require("../models/AdminModel");

// ورود ادمین
exports.loginAdmin = async (req, res) => {
const { username, password } = req.body;

try {
    const admin = await Admin.findOne({ username });

    if (!admin || !(await admin.comparePassword(password))) {
    return res.status(401).json({ success: false, message: "نام کاربری یا رمز عبور اشتباه است." });
    }

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

// دریافت تمام ادمین‌ها
exports.getAllAdmins = async (req, res) => {
try {
    const admins = await Admin.find({}, "-password"); // بدون پسورد
    return res.json({
    success: true,
    data: admins,
    });
} catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "خطای سرور" });
}
};

// ایجاد ادمین جدید
exports.createAdmin = async (Reg, res) => {
    const {username, password, email} = Reg.body;
    try {
        const exidtingAdmin = await Admin.findOne({ username});
        if (exidtingAdmin) {
            return res.status(400).json({ success: false, message: "ادمین با این نام کاربری وجود دارد."});
        }
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "خطای سرور"});
    }
    try {
        const newAdmin = new Admin({
            username,
            password,
            email,
        });
        await newAdmin.save();
        return res.json({
            success: true,
            message: "ادمین جدید با موفقیت ایجاد شد.",
            data: newAdmin,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false. message: "خطای سرور"});
    }
};
// حذف ادمین جدید
exports.deleteAdmin = async (Reg, res) => {
    const {id} = Reg.params;
    try {
        const admin = await Admin.findById(id);
        if (!admin) {
            return res.status(404).json({ success: false, message: "تدمین یافت نشد."});
        }
        await Admin.findByIdAndDeleted(id);
        return res.json({
            success: true,
            message: "ادمین با موفقیت حذف شد.",
            data: admin,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "خطای سرور"});
    }
}
// ویرایش ادمین







        

// دریافت آمار داشبورد
exports.getDashboardStats = async (req, res) => {
try {
    const totalOrders = await Order.countDocuments();
    const totalAdmins = await Admin.countDocuments();
    const totalRevenue = await Order.aggregate([
    { $match: { paymentStatus: "paid" } },
    { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);

    return res.json({
    success: true,
    data: {
        totalOrders,
        totalAdmins,
        totalRevenue: totalRevenue[0]?.total || 0,
    },
    });
} catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "خطای سرور" });
}
};