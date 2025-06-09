const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const authAdmin = require("../middleware/authMiddleware");
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../utils/upload");


// eslint-disable-next-line no-undef
router.get("/products", productController.getAllProducts);
router.post("/products", authAdmin, productController.createProduct);
router.get("/products", authMiddleware, productController.getAllProducts);
router.get("/products/:id", authMiddleware, productController.getProductById);
router.put("/products/:id", authMiddleware, productController.updateProductById);
router.delete("/products/:id", authMiddleware, productController.deleteProductById);
router.put("/products/:id", authMiddleware, upload.single("image"), productController.updateProductById);


