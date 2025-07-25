const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const authAdmin = require("../middleware/authMiddleware");
const authMiddleware = require("../middleware/authMiddleware");
const auditLogger = require("../middleware/auditLogger");
const persistentLogger = require("../middleware/persistentLogger");
const PersistentNotification = require("../models/persistentNotificationModel");
const reportController = require("../controllers/reportController");
const upload = require("../middleware/uploadMiddleware");



// مسیرهای مربوط به ادمین ها
// ورود ادمین
router.put("/dashboard/layout", authAdmin, adminController.saveDashboardLayout);
router.put("/dashboard/settings", authAdmin, adminController.saveDashboardSettings);
router.get("/dashboard", authAdmin(["admin", "editor"]), adminController.getAdminDashboardStats);
router.get("/users", authAdmin, adminController.getAllUsers);
router.get("/users", authAdmin, adminController.getAllUsers);
router.get("/dashboard/user-stats", authAdmin, adminController.getUserRegistrationStats);
router.get("/users/:id", authAdmin, adminController.getUserById);
router.get("/dashboard/stats", authAdmin, adminController.getDashboardStats);
router.put("/users/:id", authAdmin, adminController.updateUser);
router.delete("/users/:id", authAdmin, adminController.deleteUser);
router.post("/login", adminController.loginAdmin);
router.post("/users", authAdmin, adminController.createUser);
router.get("/admins", adminController.getAllAdmins); // 👈 اضافه کردیم
router.get("/admins", authAdmin, adminController.getAllAdmins);
// dashbord admin
router.get("/dashboard", authAdmin, adminController.getDashboardStats);
router.get("/dashboard", authMiddleware, adminController.getAdminDashboardStats);
router.get("/dashboard/monthly-sales", authAdmin, adminController.getMonthlySalesStats);

// اضافه کردن ادمین جدید
router.post("/admins", authAdmin, adminController.createAdmin);
// حذف ادمین
router.delete("/admins/:id", authAdmin, adminController.deleteAdmin);
// ویرایش ادمین
router.put("/admins/:id", authAdmin, adminController.updateAdmin);
// دریافت اطلاعات ادمین
router.get("/admins/:id", authAdmin, adminController.getAdminById);
// دریافت اطلاعات ادمین لاگین شده
router.get("/me", authAdmin, adminController.getLoggedInAdmin);
// تغییر رمز عبور ادمین
router.put("/change-password", authAdmin, adminController.changePassword);
// دریافت آمار کلی
router.get("/status", authAdmin, adminController.getAdminStatus);
// دریافت آمار فروش
router.get("/sales", authAdmin, adminController.getSalesStatus);
// دریافت آمار محصولات
router.get("/products", authAdmin, adminController.getProductStatus);
// دریافت آمار کاربران
router.get("/users", authAdmin, adminController.getUserStatus);
// دریافت آمار سفارشات
router.get("/orders", authAdmin, adminController.getOrderStatus);
// دریافت آمار نظرات
router.get("/reviews", authAdmin, adminController.getReviewStatus);
// دریافت آمار کوپن ها
router.get("/coupons", authAdmin, adminController.getCouponStatus);
// دریافت آمار دسته بندی ها
router.get("/categories", authAdmin, adminController.getCategoryStatus);
// دریافت آمار برندها
router.get("/brands", authAdmin, adminController.getBrandStatus);
// دریافت آمار نظرات محصولات
router.get("/product-reviews", authAdmin, adminController.getProductReviewStatus);
// دریافت نظرات کاربران
router.get("/user-reviews", authAdmin, adminController.getUserReviewStatus);
router.put("/admins/:id/role", authAdmin, adminController.updateAdminRole);
router.get("/permissions", authAdmin, adminController.getAllRoles);
router.put("/permissions", authAdmin, adminController.updateRolePermissions);
router.get("/permissions/me", authAdmin, adminController.getRolePermissions);
router.put("/permissions/:role", authAdmin, adminController.updateRolePermissions);
router.delete("/users/:id", authAdmin, auditLogger("delete_user", "user", "حذف کاربر"), adminController.deleteUser);
router.get("/logs", authAdmin(["admin"]), adminController.getAuditLogs);
router.get("/notifications", authAdmin, adminController.getNotifications);
router.put("/notifications/read/:id", authAdmin, adminController.markAsRead);
router.put("/notifications/read-all", authAdmin, adminController.markAllAsRead);
router.get("/notification/settings", authAdmin, adminController.getNotificationSettings);
router.put("/notification/settings", authAdmin, adminController.saveNotificationSettings);
router.post("/notifications/broadcast", authAdmin(["admin"]), adminController.broadcastNotification);
router.post("/notifications/global", authAdmin(["admin"]), adminController.sendGlobalNotification);
router.get("/notifications/global", authAdmin, adminController.getGlobalNotifications);
// افزودن اعلان
router.post(
"/notifications/persistent",
authAdmin,
persistentLogger("create", "افزودن اعلان دائمی"),
adminController.createPersistentNotification
);

// ویرایش اعلان
router.put(
"/notifications/persistent/:id",
authAdmin,
async (req, res, next) => {
    // ذخیره وضعیت قبلی
    const notification = await PersistentNotification.findById(req.params.id);
    if (notification) {
        req.previousData = notification.toObject();
    }
    next();
},
persistentLogger("update", "ویرایش اعلان دائمی"),
adminController.updatePersistentNotification
);

// حذف اعلان
router.delete(
"/notifications/persistent/:id",
authAdmin,
persistentLogger("delete", "حذف اعلان دائمی"),
adminController.deletePersistentNotification
);

router.get("/notifications/logs", authAdmin(["admin"]), adminController.getPersistentNotificationLogs);

router.get("/reports/scheduled", authAdmin, reportController.getAllScheduledReports);
router.post("/reports/scheduled", authAdmin, reportController.createScheduledReport);
router.delete("/reports/scheduled/:id", authAdmin, reportController.deleteScheduledReport);
router.get("/reports/history", authAdmin, reportController.getGeneratedReports);
router.delete("/reports/history/:id", authAdmin, reportController.deleteGeneratedReport);
router.get("/reports/templates", authAdmin, reportController.getReportTemplates);
router.post("/reports/templates", authAdmin, reportController.createReportTemplate);
router.put("/reports/templates/:id", authAdmin, reportController.updateReportTemplate);
router.delete("/reports/templates/:id", authAdmin, reportController.deleteReportTemplate);
router.get("/reports/archive", authAdmin, reportController.getReportArchive);
router.delete("/reports/archive/:id", authAdmin, reportController.deleteFromArchive);
router.put("/reports/archive/:id/tags", authAdmin, reportController.updateReportTags);
router.put("/reports/archive/:id/tags", authAdmin, reportController.updateReportTags);
router.get("/reports/tags/popular", authAdmin, reportController.getPopularTags);
router.get("/reports/tags/trends", authAdmin, reportController.getTagTrends);
router.get("/reports/tags/predict", authAdmin, reportController.predictTagTrends);
router.post("/reports/share-comparison", authAdmin, reportController.shareComparison);
router.get("/shared/comparison/:token", reportController.getSharedComparison);
router.get("/reports/share-analytics/:token", authAdmin, reportController.getShareAnalytics);
router.post(
"/reports/upload-template",
authAdmin,
upload.single("file"),
reportController.processDataEntryTemplate
);

module.exports = router;