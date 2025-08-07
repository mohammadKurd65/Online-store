import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { prepareOrderStatusData } from './chartUtils'; // ✅ تغییر نام تابع
import { doughnutChartOptions } from './chartUtils';   // ✅ حالا این وجود داره

const OrderStatusDoughnutChart = ({ orders }) => {
const chartData = prepareOrderStatusData(orders);

return (
    <div style={{ width: '300px', height: '300px' }}>
    <Doughnut 
        data={chartData} 
        options={doughnutChartOptions} 
    />
    </div>
);
};

export default OrderStatusDoughnutChart;