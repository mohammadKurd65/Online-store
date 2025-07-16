import { useEffect, useState } from "react";
import { io } from "socket.io-client";

export function useSocket(adminId) {
const [socket, setSocket] = useState(null);
const [notifications, setNotifications] = useState([]);

useEffect(() => {
    if (!adminId) return;

    const newSocket = io("http://localhost:5000", {
    auth: {
        adminId,
    },
    });

    setSocket(newSocket);

    // دریافت اعلان زنده
    newSocket.on("new-notification", (notification) => {
    setNotifications((prev) => [notification, ...prev]);
    });

    return () => {
    newSocket.disconnect();
    };
}, [adminId]);

return { socket, notifications, setNotifications };
}