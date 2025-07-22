const mongoose = require("mongoose");

const GlobalNotificationSchema = new mongoose.Schema({
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
audience: {
    type: String,
    enum: ["all_admins", "all_users", "admins_and_users"],
    default: "all_admins",
},
}, {
timestamps: true,
});

module.exports = mongoose.model("GlobalNotification", GlobalNotificationSchema);