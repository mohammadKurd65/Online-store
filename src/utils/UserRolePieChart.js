import { Pie } from "react-chartjs-2";

function generateRoleChartData(users) {
const roleCount = { user: 0, editor: 0, admin: 0 };
users.forEach((u) => {
    if (roleCount[u.role] !== undefined) roleCount[u.role]++;
});
return {
    labels: ["کاربر عادی", "ویرایشگر", "ادمین"],
    datasets: [
    {
        label: "تعداد",
        data: [roleCount.user, roleCount.editor, roleCount.admin],
        backgroundColor: ["#3b82f6", "#10b981", "#8b5cf6"],
        borderColor: ["#1e40af", "#047857", "#7c3aed"],
        borderWidth: 1,
    },
    ],
};
}

const chartPieOptions = {
responsive: true,
plugins: {
    legend: { position: "right" },
    title: { display: true, text: "توزیع نقش کاربران" },
},
};

export default function UserRolePieChart({ users }) {
return (
    <Pie data={generateRoleChartData(users)} options={chartPieOptions} />
    )
    };
    