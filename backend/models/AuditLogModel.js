const mongoose = require("mongoose");

const AuditLogSchema = new mongoose.Schema({
admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
    required: true,
},
action: {
    type: String,
    required: true,
    enum: [
    "login",
    "logout",
    "create_user",
    "delete_user",
    "update_user",
    "create_product",
    "update_product",
    "delete_product",
    "update_permissions",
    "manage_orders",
    "edit_settings"
    ],
},
entityType: {
    type: String,
    required: true,
    enum: ["user", "product", "order", "role", "settings"],
},
entityId: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: "entityType", // Dynamic reference based on entityType
},
description: {
    type: String,
    required: true,
},
ip: {
    type: String,
    required: true,
},
userAgent: {
    type: String,
    required: true,
}
}, {
timestamps: true,
});

module.exports = mongoose.model("AuditLog", AuditLogSchema);