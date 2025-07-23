const mongoose = require("mongoose");

const GeneratedReportSchema = new mongoose.Schema({
name: String,
title: String,
admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
},
fileUrl: String,
format: String,
fileSize: Number,
templateName: String,
tags: {
    type: [String],
    default: [],
    index: true, // برای جستجوی سریع
},
createdAt: {
    type: Date,
    default: Date.now,
},
});

module.exports = mongoose.model("GeneratedReport", GeneratedReportSchema);