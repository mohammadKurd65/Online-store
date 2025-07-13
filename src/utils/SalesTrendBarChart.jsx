import { Bar } from 'react-chartjs-2';
import {
Chart as ChartJS,
CategoryScale,
LinearScale,
BarElement,
Title,
Tooltip,
Legend,
} from 'chart.js';

ChartJS.register(
CategoryScale,
LinearScale,
BarElement,
Title,
Tooltip,
Legend
);

const generateSalesData = (orders) => {
  // Implementation for generating sales data
return {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
    label: 'Sales',
    data: orders || [],
    backgroundColor: 'rgba(53, 162, 235, 0.5)',
    }]
};
};

const salesChartOptions = {
responsive: true,
plugins: {
    legend: {
    position: 'top',
    },
    title: {
    display: true,
    text: 'Sales Trend',
    },
},
};

export default function SalesTrendBarChart({ orders }) {
return (
    <Bar data={generateSalesData(orders)} options={salesChartOptions} />
);
}