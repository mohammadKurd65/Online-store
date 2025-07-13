const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
username: {
    type: String,
    required: true,
    unique: true,
},
password: {
    type: String,
    required: true,
},
role: {
    type: String,
    enum: ["user", "editor", "admin"],
    default: "user",
},
status: {
    type: String,
    enum: ["active", "inactive", "blocked"],
    default: "active",
},
});

// هش کردن رمز قبل از ذخیره
UserSchema.pre("save", async function (next) {
if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
}
next();
});

// مقایسه رمز
UserSchema.methods.comparePassword = async function (candidatePassword) {
return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", UserSchema);