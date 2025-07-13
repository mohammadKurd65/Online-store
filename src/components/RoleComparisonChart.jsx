import React from "react";
import { decodeToken } from "../utils/jwtDecode";
import { Bar } from "react-chartjs-2";
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

export default function RoleComparisonChart({ users }) {
    const token = localStorage.getItem("userToken");
const decoded = decodeToken(token);
const userRole = decoded?.role;

if (userRole !== "admin") {
  return null; // یا یک پیام دسترسی غیرمجاز
}
const roleCount = {
    user: 0,
    editor: 0,
    admin: 0,
};

users.forEach((u) => {
    if (roleCount[u.role] !== undefined) {
    roleCount[u.role]++;
    }
});

const data = {
    labels: ["تعداد"],
    datasets: [
    {
        label: "کاربر عادی",
        backgroundColor: "#3b82f6",
        borderColor: "#2563eb",
        borderWidth: 1,
        [roleCount.user]: 0,
    },
    {
        label: "ویرایشگر",
        backgroundColor: "#10b981",
        borderColor: "#059669",
        borderWidth: 1,
        [roleCount.editor]: 0,
    },
    {
        label: "ادمین",
        backgroundColor: "#f59e0b",
        borderColor: "#d97706",
        borderWidth: 1,
        [roleCount.admin]: 0,
    },
    ],
};

const options = {
    responsive: true,
    plugins: {
    title: {
        display: true,
        text: "مقایسه تعداد کاربران بر اساس نقش",
    },
    tooltip: {
        callbacks: {
        label: (context) => `${context.raw} نفر`,
        },
    },
    legend: {
        position: "top",
    },
    toolbar: {
        display: true,
        buttons: {
            download: {
                text: "دانلود",
                onclick: () => {
                    const link = document.createElement("a");
                    link.href = document.querySelector("canvas").toDataURL("image/png");
                    link.download = "chart.png";
                    link.click();
                }
            }
            },
        },
    },
    scales: {
    y: {
        beginAtZero: true,
        ticks: {
        stepSize: 1,
        },
        title: {
            display: true,
            text: "تعداد کاربران",
        }
    },
    },
};

return <Bar data={data} options={options} />;
}