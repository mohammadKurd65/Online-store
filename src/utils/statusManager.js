const statusConfig = {
orderStatuses: [
    { value: "pending", label: "در انتظار", color: "bg-yellow-100 text-yellow-800" },
    { value: "paid", label: "پرداخت شده", color: "bg-green-100 text-green-800" },
    { value: "failed", label: "ناموفق", color: "bg-red-100 text-red-800" },
    { value: "canceled", label: "لغو شده", color: "bg-gray-100 text-gray-800" },
],
adminRoles: [
    { value: "admin", label: "ادمین", color: "bg-blue-100 text-blue-800" },
    { value: "editor", label: "ویرایشگر", color: "bg-purple-100 text-purple-800" },
    { value: "viewer", label: "مشاهده‌گر", color: "bg-gray-100 text-gray-800" },
],
};

export function getStatusLabel(status, type = "orderStatuses") {
const item = statusConfig[type].find((s) => s.value === status);
return item ? item.label : "ناشناخته";
}

export function getStatusColor(status, type = "orderStatuses") {
const item = statusConfig[type].find((s) => s.value === status);
return item ? item.color : "bg-gray-100 text-gray-800";
}

export default statusConfig;