import React from "react";
import { Bar } from "react-chartjs-2";
import { decodeToken } from "../utils/jwtDecode";
import {
Chart as ChartJS,
CategoryScale,
LinearScale,
BarElement,
Title,
Tooltip,
Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function UserStatusBarChart({ users }) {
    const token = localStorage.getItem("userToken");
const decoded = decodeToken(token);
const userRole = decoded?.role;

if (userRole !== "admin") {
  return null; // یا یک پیام دسترسی غیرمجاز
}
const statusCounts = {
    active: 0,
    inactive: 0,
    blocked: 0,
};

users.forEach((user) => {
    if (user.status in statusCounts) {
    statusCounts[user.status]++;
    }
});

const data = {
    labels: ["فعال", "غیرفعال", "مسدود"],
    datasets: [
    {
        label: "تعداد کاربران",
        backgroundColor: "#10b981",
        borderColor: "#059669",
        borderWidth: 1,
        data: [statusCounts.active, statusCounts.inactive, statusCounts.blocked],
    },
    ],
};

const options = {
    responsive: true,
    plugins: {
    legend: { display: false },
    title: {
        display: true,
        text: "وضعیت کاربران",
    },
    tooltip: {
        callbacks: {
        label: (context) => `${context.raw} کاربر`,
        },},
    },
    scales: {
    y: {
        beginAtZero: true,
        ticks: {
        stepSize: 1,
        },
    },
    },
};

return <Bar data={data} options={options} />;
}