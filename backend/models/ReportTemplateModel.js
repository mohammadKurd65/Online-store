const mongoose = require("mongoose");

const ReportTemplateSchema = new mongoose.Schema({
name: {
    type: String,
    required: true,
},
title: {
    type: String,
    required: true,
},
sections: {
    type: [String],
    default: ["summary", "logs"],
},
defaultFormat: {
    type: String,
    enum: ["pdf", "excel"],
    default: "pdf",
},
includeSummary: {
    type: Boolean,
    default: true,
},
includeCharts: {
    type: Boolean,
    default: true,
},
admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
    required: true,
},
}, {
timestamps: true,
});

module.exports = mongoose.model("ReportTemplate", ReportTemplateSchema);