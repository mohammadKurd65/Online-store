const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

// eslint-disable-next-line no-undef
router.get("/products", productController.getAllProducts);
router.get("/products", productController.getAllProducts);
