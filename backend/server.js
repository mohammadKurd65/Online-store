const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const paymentRoutes = require("./routes/paymentRoutes");

dotenv.config();

// Connect to DB
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
const orderRoutes = require("./routes/orderRoutes");

// Routes
app.use("/api/payment", paymentRoutes);
app.use("/api/orders", orderRoutes); // 👈 اضافه کردیم

app.listen(PORT, () => {
console.log(`Server running on port ${PORT}`);
});