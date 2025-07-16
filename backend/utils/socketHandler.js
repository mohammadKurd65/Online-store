// const { Notification } = require("../models/NotificationModel");

let io;

exports.setupSocket = (server) => {
io = require("socket.io")(server, {
    cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    },
});

io.on("connection", (socket) => {
    console.log("🟢 یک ادمین متصل شد:", socket.id);

    // دریافت اعلان‌ها
    socket.on("joinAdminRoom", async (adminId) => {
    socket.join(`admin_${adminId}`);
    console.log(`🔵 ادمین ${adminId} به اتاق خود متصل شد.`);
    });

    socket.on("disconnect", () => {
    console.log("🔴 یک ادمین قطع ارتباط داد.");
    });
});
};

exports.broadcastGlobalNotification = (notification) => {
io.emit("new-global-notification", notification);
};

// فرستادن اعلان به یک ادمین
exports.sendNotificationToAdmin = (adminId, notification) => {
io.to(`admin_${adminId}`).emit("new-notification", notification);
};