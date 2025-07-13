import React from "react";
import { decodeToken } from "../utils/jwtDecode"; 
import { getStatusLabel, getStatusColor } from "../utils/statusManager";

export default function StatusBadge({ status, type = "orderStatuses" }) {
    const token = localStorage.getItem("userToken");
const decoded = decodeToken(token);
const userRole = decoded?.role;

if (userRole !== "admin") {
  return null; // یا یک پیام دسترسی غیرمجاز
}
return (
    <span className={`inline-block px-3 py-1 rounded-full text-sm ${getStatusColor(status, type)}`}>
    {getStatusLabel(status, type)}
    </span>
);
}