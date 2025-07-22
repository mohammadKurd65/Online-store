import React from "react";

export default function DataDiffView({ oldData, newData }) {
const allKeys = new Set([...Object.keys(oldData || {}), ...Object.keys(newData || {})]);
const entries = Array.from(allKeys).map((key) => {
    const oldValue = oldData?.[key];
    const newValue = newData?.[key];

    if (oldValue === undefined) {
    return { key, type: "added", value: newValue };
    }
    if (newValue === undefined) {
    return { key, type: "removed", value: oldValue };
    }
    if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
    return { key, type: "modified", oldValue, newValue };
    }
    return { key, type: "unchanged", value: oldValue };
});

return (
    <div className="space-y-2">
    {entries.map(({ key, type, value, oldValue, newValue }) => {
        const labelColor =
        type === "added"
            ? "text-green-700 bg-green-100"
            : type === "removed"
            ? "text-red-700 bg-red-100"
            : type === "modified"
            ? "text-yellow-700 bg-yellow-100"
            : "text-gray-700 bg-gray-100";

        return (
        <div key={key} className={`p-3 rounded border-l-4 ${getBorderColor(type)}`}>
            <span className={`px-2 py-1 text-xs font-semibold rounded ${labelColor}`}>
            {getFieldLabel(type)}
            </span>
            <span className="mr-2 font-medium">{key}</span>

            {type === "added" && (
            <span className="text-green-800">→ {formatValue(newValue)}</span>
            )}

            {type === "removed" && (
            <span className="text-red-800">← {formatValue(value)}</span>
            )}

            {type === "modified" && (
            <span className="block mt-1 text-sm">
                <del className="text-red-500">{formatValue(oldValue)}</del>
                <br />
                <ins className="text-green-600">{formatValue(newValue)}</ins>
            </span>
            )}

            {type === "unchanged" && (
            <span className="text-gray-800">{formatValue(value)}</span>
            )}
        </div>
        );
    })}
    </div>
);
}

// --- توابع کمکی ---

function getFieldLabel(type) {
const labels = {
    added: "افزوده شد",
    removed: "حذف شد",
    modified: "تغییر کرد",
    unchanged: "بدون تغییر",
};
return labels[type];
}

function getBorderColor(type) {
switch (type) {
    case "added":
    return "border-green-500";
    case "removed":
    return "border-red-500";
    case "modified":
    return "border-yellow-500";
    default:
    return "border-gray-300";
}
}

function formatValue(value) {
if (value === null) return "null";
if (typeof value === "object") {
    return JSON.stringify(value);
}
return String(value);
}