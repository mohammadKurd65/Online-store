const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const paymentRoutes = require("./routes/paymentRoutes");
const orderRoutes = require("./routes/orderRoutes");
const adminRoutes = require("./routes/adminRoutes");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const mongoose = require("mongoose");
const http = require("http");
const app = express();
const server = http.createServer(app);
const nodemailer = require("nodemailer");
const path = require("path");
const seedReportTags = require("./utils/seedReportTags");
const socketIo = require("socket.io");
const io = socketIo(server, {
cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
},
});
// ارسال رویداد زنده وقتی کسی لینک رو باز میکنه
io.on("connection", (socket) => {
console.log("کاربر به سیستم آنالیز زنده متصل شد:", socket.id);

socket.on("disconnect", () => {
    console.log("کاربر قطع شد:", socket.id);
});
});

app.use((req, res, next) => {
res.header("Access-Control-Allow-Origin", "*");
res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
next();
});


exports.sendReportByEmail = async (to, format) => {
const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
    },
});

const filename = `report.${format}`;
const pathToFile = path.join(__dirname, "../temp", filename);

  // فرض می‌کنیم گزارش قبلاً تولید شده
const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: "گزارش خودکار از سیستم مدیریت",
    text: "گزارش شما ضمیمه شده است.",
    attachments: [
    {
        filename,
        path: pathToFile,
    },
    ],
};

await transporter.sendMail(mailOptions);
};

io.on("connection", (socket) => {
console.log("🟢 اتصال ادمین:", socket.id);
socket.on("joinAdminRoom", (adminId) => {
    socket.join(`admin_${adminId}`);
    console.log(`🔵 ادمین ${adminId} به اتاق خود پیوست.`);
});

socket.on("disconnect", () => {
    console.log("🔴 یک ادمین قطع ارتباط داد.");
});
});

// ✅ راه‌اندازی Socket.IO
const { setupSocket } = require("./utils/socketHandler");
setupSocket(server);

dotenv.config();

// Connect to DB
connectDB();


const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/payment", paymentRoutes);
app.use("/api/orders", orderRoutes);
app.use('/api/admin', adminRoutes.default || adminRoutes);
app.use("/api/user", userRoutes);
// قبل از خط 102

console.log("Admin Routes Type:", typeof adminRoutes);
console.log("Admin Routes has default:", 'default' in adminRoutes);

// خط 102 را اینطوری تغییر دهید
if (typeof adminRoutes === 'function') {
app.use('/api/admin', adminRoutes);
} else if (adminRoutes && adminRoutes.default) {
console.log("Using default export for admin routes");
app.use('/api/admin', adminRoutes.default);
} else {
console.error("Admin routes is not a valid router!");
process.exit(1);
}
app.use("/images", express.static("public/images"));

app.listen(PORT, () => {
console.log(`Server running on port ${PORT}`);
});

const seedRoles = require("./utils/seedRoles");

mongoose.connection.once("open", async () => {
await seedRoles();
await seedReportTags();
});

// مدیریت خطا برای پورت اشغال‌شده
// const server = app.listen(PORT, () => {
// console.log(`Server running on port ${PORT}`);
// });

server.on('error', (error) => {
if (error.code === 'EADDRINUSE') {
    console.log(`Port ${PORT} is already in use. Trying port ${PORT + 1}...`);
    setTimeout(() => {
    server.close();
    app.listen(PORT + 1, () => {
        console.log(`Server running on port ${PORT + 1}`);
    });
    }, 1000);
} else {
    console.error(error);
}
});

server.listen(PORT, () => {
console.log(`Server is running on port ${PORT}`);
});

module.exports = { server, io };