// backend/utils/seedRoles.js
const AdminRole = require("../models/AdminRoleModel");

const seedRoles = async () => {
const roles = [
    {
    name: "user",
    permissions: ["view_dashboard", "edit_profile"],
    },
    {
    name: "editor",
    permissions: ["view_dashboard", "edit_profile", "edit_products", "manage_orders"],
    },
    {
    name: "admin",
    permissions: ["view_dashboard", "edit_profile", "edit_products", "delete_users", "manage_orders", "manage_permissions"],
    },
];

for (const role of roles) {
    const existing = await AdminRole.findOne({ name: role.name });
    if (!existing) {
    await AdminRole.create(role);
    }
    // Update permissions if role already exists
    else {
        await AdminRole.findByIdAndUpdate(existing._id, { permissions: role.permissions });
    }
    console.log(`Role ${role.name} seeded with permissions: ${role.permissions.join(",")}`);
}

};

module.exports = seedRoles;