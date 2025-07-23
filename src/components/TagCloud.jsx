import React from "react";

export default function TagCloud({ tags, onTagClick, title = "تگ‌ها" }) {
  // محاسبه فراوانی تگ‌ها
const tagCounts = tags.reduce((acc, tag) => {
    acc[tag] = (acc[tag] || 0) + 1;
    return acc;
}, {});

  // تعیین اندازه فونت بر اساس تعداد استفاده
const maxCount = Math.max(...Object.values(tagCounts), 1);
const getFontSize = (count) => {
    const minSize = 12;
    const maxSize = 24;
    return Math.floor(minSize + (count / maxCount) * (maxSize - minSize));
};

return (
    <div className="p-6 mb-8 bg-white rounded shadow">
    <h3 className="mb-4 text-xl font-semibold">{title}</h3>
    <div className="flex flex-wrap gap-2">
        {Object.keys(tagCounts).length === 0 ? (
        <p className="text-sm text-gray-500">هیچ تگی وجود ندارد.</p>
        ) : (
        Object.keys(tagCounts)
            .sort(() => Math.random() - 0.5) // برای پراکندگی بصری
            .map((tag) => (
            <button
                key={tag}
                onClick={() => onTagClick?.(tag)}
                style={{ fontSize: `${getFontSize(tagCounts[tag])}px` }}
                className="px-3 py-1 text-blue-800 transition-colors duration-200 bg-blue-100 rounded-full hover:bg-blue-200 whitespace-nowrap"
            >
                {tag}
            </button>
            ))
        )}
    </div>
    </div>
);
}