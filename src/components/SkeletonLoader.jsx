import React from "react";

export default function SkeletonLoader({ type = "table" }) {
if (type === "table") {
    return (
    <div className="space-y-4 animate-pulse">
        {[...Array(5)].map((_, i) => (
        <div key={i} className="w-full h-10 bg-gray-200 rounded"></div>
        ))}
    </div>
    );
}

  // Default loader
return (
    <div className="flex items-center justify-center py-10">
    <div className="w-10 h-10 border-4 border-blue-200 rounded-full border-t-blue-500 animate-spin"></div>
    </div>
);
}