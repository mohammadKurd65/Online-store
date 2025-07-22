const mongoose = require("mongoose");

const PersistentNotificationLogSchema = new mongoose.Schema(
{
    admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
    required: true,
    },
    action: {
    type: String,
    enum: ["create", "update", "delete", "activate", "deactivate"],
    required: true,
    },
    notificationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PersistentNotification",
    },
    previousData: {
    type: Object,
    },
    newData: {
    type: Object,
    },
    description: {
    type: String,
    },
    ip: {
    type: String,
    required: true,
    },
    userAgent: {
    type: String,
    required: true,
    },
},
{ timestamps: true }
);

module.exports = mongoose.model("PersistentNotificationLog", PersistentNotificationLogSchema);