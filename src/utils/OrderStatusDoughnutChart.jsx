import { Doughnut } from 'react-chartjs-2';
import { generateOrderStatusData, doughnutChartOptions } from './chartUtils';

export default function OrderStatusDoughnutChart({ orders }) {
return (
    <Doughnut data={generateOrderStatusData(orders)} options={doughnutChartOptions} />
);
}