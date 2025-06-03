const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
{
    user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false,
    },
    products: [
    {
        productId: {
        type: String,
        required: true,
        },
        name: {
        type: String,
        required: true,
        },
        price: {
        type: Number,
        required: true,
        },
        quantity: {
        type: Number,
        default: 1,
        },
    },
    ],
    amount: {
    type: Number,
    required: true,
    },
    transactionId: {
    type: String,
    default: null,
    },
    paymentStatus: {
    type: String,
    enum: ["pending", "paid", "failed", "canceled"],
    default: "pending",
    },
    authority: {
    type: String,
    required: true,
    },
},
{ timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);