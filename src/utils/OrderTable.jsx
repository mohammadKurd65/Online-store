import { Link } from "react-router-dom";
import { getStatusColor, getStatusLabel } from "./statusManager";

export default function OrderTable({ orders }) {
return (
    <div className="overflow-x-auto">
    <table className="min-w-full bg-white border rounded shadow">
        <thead className="bg-gray-100">
        <tr>
            <th className="px-4 py-2 text-left border-b">شناسه</th>
            <th className="px-4 py-2 text-left border-b">مبلغ</th>
            <th className="px-4 py-2 text-left border-b">وضعیت</th>
            <th className="px-4 py-2 text-left border-b">مشاهده</th>
        </tr>
        </thead>
        <tbody>
        {orders.length === 0 ? (
            <tr>
            <td colSpan="4" className="py-4 text-center">
                سفارشی یافت نشد.
            </td>
            </tr>
        ) : (
            orders.map((order) => (
            <tr key={order._id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border-b">{order._id}</td>
                <td className="px-4 py-2 border-b">
                {(order.amount ?? 0).toLocaleString()} تومان
                </td>
                <td className="px-4 py-2 border-b">
                <span
                    className={`inline-block px-3 py-1 rounded-full text-sm ${getStatusColor(
                    order.paymentStatus,
                    "orderStatuses"
                    )}`}
                >
                    {getStatusLabel(order.paymentStatus, "orderStatuses")}
                </span>
                </td>
                <td className="px-4 py-2 border-b">
                <Link
                    to={`/admin/order/${order._id}`}
                    className="text-blue-500 hover:underline"
                >
                    مشاهده
                </Link>
                </td>
            </tr>
            ))
        )}
        </tbody>
    </table>
    </div>
    );
}