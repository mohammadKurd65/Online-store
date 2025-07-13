const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");
const authUser = require("../middleware/authMiddleware");

router.get("/profile", authUser(["user", "editor", "admin"]), userController.getUserProfile);


router.post("/login", userController.loginUser);
router.post("/register", userController.registerUser);
router.get("/profile", authMiddleware, userController.getUserProfile);
router.put("/profile", authMiddleware, userController.updateUserProfile);
router.delete("/profile", authMiddleware, userController.deleteUserProfile);


module.exports = router;