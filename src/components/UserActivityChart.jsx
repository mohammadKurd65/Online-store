import React from "react";
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

export default function UserActivityChart({ users }) {
  // محاسبه تعداد کاربران بر اساس ماه
const monthlyCount = {};

users.forEach((user) => {
    const date = new Date(user.createdAt);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

    if (!monthlyCount[monthKey]) {
    monthlyCount[monthKey] = 0;
    }
    monthlyCount[monthKey]++;
});

const labels = Object.keys(monthlyCount).sort();
const dataValues = labels.map((label) => monthlyCount[label]);

const chartData = {
    labels,
    datasets: [
    {
        label: "ثبت‌نام‌های ماهانه",
        backgroundColor: "rgba(59, 130, 246, 0.6)",
        borderColor: "rgb(59, 130, 246)",
        borderWidth: 1,
        data: dataValues,
    },
    ],
};

const options = {
responsive: true,
plugins: {
    legend: { display: false },
    title: {
    display: true,
    text: "روند ثبت‌نام کاربران",
    font: {
        size: 20,
        family: "Vazir, sans-serif",
        style: "normal",
        weight: "bold",
    },
    },
    tooltip: {
    callbacks: {
        label: (context) => `${context.raw} کاربر`,
    },
    },
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


return <Bar data={chartData} options={options} />;
}