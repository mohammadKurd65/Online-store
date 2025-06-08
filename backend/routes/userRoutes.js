const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/login", userController.loginUser);
router.post("/register", userController.registerUser);
router.get("/profile", authMiddleware, userController.getUserProfile);

module.exports = router;