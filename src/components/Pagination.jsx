import React from "react";

export default function Pagination({ currentPage, totalPages, onPageChange }) {
return (
    <div className="flex justify-center mt-6">
    <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-4 py-2 mx-1 bg-gray-200 rounded ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-300"}`}
    >
        قبلی
    </button>

    {[...Array(totalPages)].map((_, i) => (
        <button
        key={i + 1}
        onClick={() => onPageChange(i + 1)}
        className={`px-4 py-2 mx-1 rounded ${currentPage === i + 1 ? "bg-blue-500 text-white" : "bg-gray-200 hover:bg-gray-300"}`}
        >
        {i + 1}
        </button>
    ))}

    <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-4 py-2 mx-1 bg-gray-200 rounded ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-300"}`}
    >
        بعدی
    </button>
    </div>
);
}