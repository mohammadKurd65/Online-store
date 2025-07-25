const mongoose = require("mongoose");

const ShareViewLogSchema = new mongoose.Schema({
sharedComparison: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SharedComparison",
    required: true,
},
ip: {
    type: String,
    required: true,
},
userAgent: {
    type: String,
    required: true,
},
browser: {
    type: String,
},
device: {
    type: String,
},
os: {
    type: String,
},
city: {
    type: String,
},
country: {
    type: String,
},
viewedAt: {
    type: Date,
    default: Date.now,
},
});

module.exports = mongoose.model("ShareViewLog", ShareViewLogSchema);