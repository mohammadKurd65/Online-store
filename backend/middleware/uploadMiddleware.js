const multer = require("multer");

const storage = multer.diskStorage({
destination: (req, file, cb) => {
    cb(null, "uploads/");
},
filename: (req, file, cb) => {
    cb(null, `data-entry-${Date.now()}.xlsx`);
},
});

module.exports = multer({ 
storage,
fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
    cb(null, true);
    } else {
    cb(new Error("فقط فایل‌های اکسل مجاز هستند."));
    }
}
});