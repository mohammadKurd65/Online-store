
import React from "react";

export default function Pagination({ currentPage, totalPages, onPageChange }) {
const pages = [];

for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
}

return (
    <div className="flex justify-center mt-6 space-x-2 space-x-reverse">
    <button
        onClick={() => onPageChange(pages - 1)}
        disabled={currentPage === 1}
        className={`px-3 py-1 rounded ${currentPage === 1 ? "bg-gray-200 cursor-not-allowed" : "bg-blue-500 text-white hover:bg-blue-600"}`}
    >
        قبلی
    </button>

    {pages.map((p) => (
        <button
        key={p}
        onClick={() => onPageChange(p)}
        className={`px-3 py-1 rounded ${currentPage === p ? "bg-blue-700 text-white" : "bg-gray-200 hover:bg-gray-300"}`}
        >
        {p}
        </button>
    ))}

    <button
        onClick={() => onPageChange(pages + 1)}
        disabled={currentPage === totalPages}
        className={`px-3 py-1 rounded ${currentPage === totalPages ? "bg-gray-200 cursor-not-allowed" : "bg-blue-500 text-white hover:bg-blue-600"}`}
    >
        بعدی
    </button>
    </div>
);
}