const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const AdminSchema = new mongoose.Schema({
username: {
    type: String,
    required: true,
    unique: true,
},
password: {
    type: String,
    required: true,
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