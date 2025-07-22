const mongoose = require("mongoose");

const ScheduledReportSchema = new mongoose.Schema({
name: {
    type: String,
    required: true,
},
email: {
    type: String,
    required: true,
match: [/.+\@.+\..+/, "ایمیل نامعتبر است"],
},
frequency: {
    type: String,
    enum: ["daily", "weekly", "monthly"],
    default: "weekly",
},
format: {
    type: String,
    enum: ["pdf", "excel"],
    default: "pdf",
},
startTime: {
    type: String,
    default: "09:00",
},
admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
    required: true,
},
}, {
timestamps: true,
});

module.exports = mongoose.model("ScheduledReport", ScheduledReportSchema);