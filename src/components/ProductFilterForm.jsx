import React from "react";

export default function ProductFilterForm({ filters, onFilterChange }) {
return (
    <div className="p-4 mb-6 bg-white rounded shadow">
    <h3 className="mb-4 text-lg font-semibold">فیلتر محصولات</h3>

      {/* دسته‌بندی */}
    <div className="mb-4">
        <label className="block mb-2 text-sm text-gray-600">دسته‌بندی</label>
        <select
        value={filters.category || ""}
        onChange={(e) => onFilterChange({ ...filters, category: e.target.value })}
        className="w-full px-3 py-2 text-sm border rounded"
        >
        <option value="">همه دسته‌ها</option>
        <option value="electronics">الکترونیک</option>
        <option value="clothing">پوشاک</option>
        <option value="books">کتاب</option>
        <option value="home">خانه و آشپزخانه</option>
        </select>
    </div>

      {/* قیمت */}
    <div className="mb-4">
        <label className="block mb-2 text-sm text-gray-600">قیمت</label>
        <select
        value={filters.priceRange || ""}
        onChange={(e) => onFilterChange({ ...filters, priceRange: e.target.value })}
        className="w-full px-3 py-2 text-sm border rounded"
        >
        <option value="">همه قیمت‌ها</option>
        <option value="0-500000">زیر ۵۰۰ هزار تومان</option>
        <option value="500000-1000000">۵۰۰ هزار - ۱ میلیون</option>
        <option value="1000000-5000000">۱ میلیون - ۵ میلیون</option>
        <option value="5000000">بالای ۵ میلیون</option>
        </select>
    </div>

      {/* موجودی */}
    <div className="flex items-center mb-4">
        <input
        type="checkbox"
        id="inStock"
        checked={filters.inStock}
        onChange={() => onFilterChange({ ...filters, inStock: !filters.inStock })}
        className="mr-2"
        />
        <label htmlFor="inStock" className="text-sm text-gray-700">فقط محصولات موجود</label>
    </div>

      {/* وضعیت */}
    <div className="mb-4">
        <label className="block mb-2 text-sm text-gray-600">وضعیت</label>
        <select
        value={filters.status || ""}
        onChange={(e) => onFilterChange({ ...filters, status: e.target.value })}
        className="w-full px-3 py-2 text-sm border rounded"
        >
        <option value="">همه</option>
        <option value="new">جدید</option>
        <option value="on-sale">در حال فروش</option>
        <option value="out-of-stock">تمام شده</option>
        </select>
    </div>
    </div>
);
}