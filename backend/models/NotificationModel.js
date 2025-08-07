const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema(
{
    admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
    required: true,
    },
    title: {
    type: String,
    required: true,
    },
    message: {
    type: String,
    required: true,
    },
    type: {
    type: String,
    enum: ["info", "warning", "success", "danger"],
    default: "info",
    },
    read: {
    type: Boolean,
    default: false,
    },
    actionUrl: {
    type: String,
    },
    entityType: {
    type: String,
    enum: ["user", "product", "order", "role", "settings"],
    },
    entityId: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: "entityType",
    },
    user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
    required: true,
},
createdAt: {
    type: Date,
    default: Date.now,
},

},
{ timestamps: true }
);

module.exports = mongoose.model("Notification", NotificationSchema);