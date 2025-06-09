const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
{
    name: {
    type: String,
    required: true,
    trim: true,
      index: true, // برای جستجوی سریع
    },
    description: {
    type: String,
    trim: true,
    },
    price: {
    type: Number,
    required: true,
    min: [0, "قیمت نمیتواند منفی باشد"],
    },
    category: {
    type: String,
    required: true,
    enum: ["electronics", "clothing", "books", "home", "others"],
    default: "others",
    },
    image: {
    type: String,
    default: "/images/placeholder.jpg",
    },
    stock: {
    type: Number,
    required: true,
    min: [0, "موجودی نمیتواند منفی باشد"],
    default: 0,
    },
    status: {
    type: String,
    enum: ["new", "on-sale", "out-of-stock"],
    default: "new",
    },
    user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    },
},
{ timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);

