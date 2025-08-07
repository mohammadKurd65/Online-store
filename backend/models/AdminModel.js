const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");




const AdminSchema = new mongoose.Schema({
username: {
    type: String,
    required: true,
    unique: true
},
password: {
    type: String,
    required: true
},
createdAt: {
    type: Date,
    default: Date.now
},
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
AdminSchema.pre('save', async function(next) {
if (!this.isModified('password')) {
    return next();
}
try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
} catch (error) {
    next(error);
}
});

// بررسی پسورد
AdminSchema.methods.matchPassword = async function(password) {
return await bcrypt.compare(password, this.password);
};


module.exports = mongoose.model("Admin", AdminSchema);