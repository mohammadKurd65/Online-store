import React from "react";
import { getStatusLabel, getStatusColor } from "../utils/statusManager";

export default function StatusBadge({ status, type = "orderStatuses" }) {
return (
    <span className={`inline-block px-3 py-1 rounded-full text-sm ${getStatusColor(status, type)}`}>
    {getStatusLabel(status, type)}
    </span>
);
}