const multer = require("multer");
const path = require("path");

// تنظیم محل ذخیره
const storage = multer.diskStorage({
destination: function (req, file, cb) {
    cb(null, "public/images/");
},
filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
},
});

const upload = multer({ storage });

module.exports = upload;