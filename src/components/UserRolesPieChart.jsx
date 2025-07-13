import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const UserRolesPieChart = ({ data }) => {
    const chartData = {
        labels: ['Admin', 'User', 'Guest'],
        datasets: [
            {
                data: data || [3, 15, 7], // Default values if no data provided
                backgroundColor: [
                    'rgba(255, 99, 132, 0.8)',
                    'rgba(54, 162, 235, 0.8)',
                    'rgba(255, 206, 86, 0.8)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'bottom',
            },
            title: {
                display: true,
                text: 'User Roles Distribution',
            },
        },
    };

    return (
        <div style={{ maxWidth: '400px', margin: '0 auto' }}>
            <Pie data={chartData} options={options} />
        </div>
    );
};

export default UserRolesPieChart;