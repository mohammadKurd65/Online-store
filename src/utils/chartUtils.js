// Example: Utility to prepare data for doughnut chart
export const prepareOrderStatusData = (orders) => {
const counts = orders.reduce((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
}, {});

return {
    labels: Object.keys(counts),
    datasets: [
    {
        data: Object.values(counts),
        backgroundColor: [
        '#FF6384',
        '#36A2EB',
        '#FFCE56',
        '#4BC0C0',
        '#9966FF',
        ],
    },
    ]
};
};


// ✅ اضافه کردن تابع جدید برای گزینه‌های نمودار
export const doughnutChartOptions = {
responsive: true,
plugins: {
    legend: {
    position: 'right',
    },
    title: {
    display: true,
    text: 'وضعیت سفارشات',
    },
},
};