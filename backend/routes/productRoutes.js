const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const authAdmin = require("../middleware/authMiddleware");
const authMiddleware = require("../middleware/authMiddleware");


// eslint-disable-next-line no-undef
router.get("/products", productController.getAllProducts);
router.post("/products", authAdmin, productController.createProduct);
router.get("/products", authMiddleware, productController.getAllProducts);
router.get("/products/:id", authMiddleware, productController.getProductById);
router.put("/products/:id", authMiddleware, productController.updateProductById);
router.delete("/products/:id", authMiddleware, productController.deleteProductById);


