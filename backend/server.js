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
const io = require("socket.io")(server, {
cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    }
});

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
app.use("/api/admin", adminRoutes);
app.use("/api/user", userRoutes);
app.use("/api", productRoutes);
app.use("/images", express.static("public/images"));

app.listen(PORT, () => {
console.log(`Server running on port ${PORT}`);
});

const seedRoles = require("./utils/seedRoles");

mongoose.connection.once("open", async () => {
await seedRoles();
});