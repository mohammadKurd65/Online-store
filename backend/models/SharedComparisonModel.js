const mongoose = require("mongoose");

const SharedComparisonSchema = new mongoose.Schema({
versionA: {
    type: Object,
    required: true,
},
versionB: {
    type: Object,
    required: true,
},
sharedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
    required: true,
},
token: {
    type: String,
    required: true,
    unique: true,
},
expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 روز
},
views: {
    type: Number,
    default: 0,
},
}, {
timestamps: true,
});

module.exports = mongoose.model("SharedComparison", SharedComparisonSchema);