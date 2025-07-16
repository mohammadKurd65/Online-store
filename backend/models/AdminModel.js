const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");




const AdminSchema = new mongoose.Schema({
username: String,
password: String,
role: {
    type: String,
    default: "admin",
},
notificationSettings: {
    type: {
    enableEmail: Boolean,
    enablePush: Boolean,
    enableSound: Boolean,
    theme: String,
    actionTypes: {
        info: Boolean,
        warning: Boolean,
        success: Boolean,
        danger: Boolean,
    },
    },
    default: {
    enableEmail: true,
    enablePush: true,
    enableSound: false,
    theme: "light",
    actionTypes: {
        info: true,
        warning: true,
        success: true,
        danger: true,
    },
    },
},
});

// هش کردن پسورد قبل از ذخیره
AdminSchema.pre("save", async function (next) {
if (!this.isModified("password")) return next();
this.password = await bcrypt.hash(this.password, 10);
next();
});

// مقایسه پسورد
AdminSchema.methods.comparePassword = async function (candidatePassword) {
return await bcrypt.compare(candidatePassword, this.password);
};


module.exports = mongoose.model("Admin", AdminSchema);