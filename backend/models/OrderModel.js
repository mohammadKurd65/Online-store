const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
{
    user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false,
    },
    items: [{
    product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
    },
    quantity: {
    type: Number,
    required: true,
    default: 1
    },
    price: {
    type: Number,
    required: true
    }
}],
totalAmount: {
    type: Number,
    required: true
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
    shippingAddress: {
    type: Object,
    required: true
},
createdAt: {
    type: Date,
    default: Date.now
},
    authority: {
    type: String,
    required: true,
    },
},
{ timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);