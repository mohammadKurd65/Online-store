import { Bar } from "react-chartjs-2";

const chartOptions = {
responsive: true,
plugins: {
    legend: { display: false },
    title: { display: true, text: "فعالیت کاربران" },
},
scales: {
    y: { beginAtZero: true, ticks: { stepSize: 1 } },
},
};

function generateChartData(users) {
const monthlyCount = {};
users.forEach((user) => {
    const date = new Date(user.createdAt);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    if (!monthlyCount[monthKey]) monthlyCount[monthKey] = 0;
    monthlyCount[monthKey]++;
});
const labels = Object.keys(monthlyCount).sort();
const dataValues = labels.map((label) => monthlyCount[label]);
return {
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
}

export default function UserActivityChart({ users }) {
return <Bar data={generateChartData(users)} options={chartOptions} />;
}