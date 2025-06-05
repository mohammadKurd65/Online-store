const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const authAdmin = require("../middleware/authMiddleware");



// مسیرهای مربوط به ادمین ها
// ورود ادمین



router.post("/login", adminController.loginAdmin);
router.get("/admins", adminController.getAllAdmins); // 👈 اضافه کردیم
router.get("/admins", authAdmin, adminController.getAllAdmins);
// اضافه کردن ادمین جدید
router.post("/admins", authAdmin, adminController.addAdmin);
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




module.exports = router;