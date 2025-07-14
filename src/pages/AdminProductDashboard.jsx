import React, { useEffect, useState, useNavigate } from "react";
import axios from "axios";
import { decodeToken } from "../utils/jwtDecode";
import {
ReusableFilterForm,
BulkDeleteModal,
ProductCard,
Pagination,
} from "../components";
import HasPermission from "../components/HasPermission";
import { usePermission } from "../hooks/usePermission";
export default function AdminProductDashboard() {
    const { canDeleteUsers } = usePermission();

if (canDeleteUsers) {
  // نمایش دکمه حذف
}
const [products, setProducts] = useState([]);
const [loading, setLoading] = useState(true);
const [selectedProducts, setSelectedProducts] = useState([]);
const [showBulkModal, setShowBulkModal] = useState(false);
const navigate = useNavigate();

  // فیلترها
const [filters, setFilters] = useState({
    category: "",
    status: "",
    minPrice: "",
    maxPrice: "",
    inStock: false,
    searchTerm: "",
});

const [debouncedSearch, setDebouncedSearch] = useState(filters.searchTerm);

  // صفحه‌بندی
const [page, setPage] = useState(1);
const [totalPages, setTotalPages] = useState(1);

const token = localStorage.getItem("userToken");
const decoded = decodeToken(token);
const userRole = decoded?.role;

useEffect(() => {
if (userRole !== "admin") {
    navigate("/unauthorized");
}
}, [userRole, navigate]);

 // تنظیم debounce
useEffect(() => {
    const timer = setTimeout(() => {
    setFilters((prev) => ({ ...prev, searchTerm: debouncedSearch }));
    }, 300);

    return () => clearTimeout(timer);
}, [debouncedSearch]);

// درخواست API
useEffect(() => {
    const fetchProducts = async () => {
    try {
        const token = localStorage.getItem("adminToken");
        const params = new URLSearchParams();

        if (filters.category) params.append("category", filters.category);
        if (filters.status) params.append("status", filters.status);
        if (filters.minPrice) params.append("minPrice", filters.minPrice);
        if (filters.maxPrice) params.append("maxPrice", filters.maxPrice);
        if (filters.inStock) params.append("inStock", true);
        if (filters.searchTerm) params.append("search", filters.searchTerm);

        params.append("page", page);

        const res = await axios.get(`http://localhost:5000/api/products?${params}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        });

        setProducts(res.data.data || []);
        setTotalPages(res.data.pagination.totalPages || 1);
    } catch (err) {
        console.error(err);
    } finally {
        setLoading(false);
    }
    };

    fetchProducts();
}, [filters, page]);

const handleSelectAll = (e) => {
    if (e.target.checked) {
    setSelectedProducts(products.map((p) => p._id));
    } else {
    setSelectedProducts([]);
    }
};

const handleCheckboxChange = (id) => {
    if (selectedProducts.includes(id)) {
    setSelectedProducts(selectedProducts.filter((i) => i !== id));
    } else {
    setSelectedProducts([...selectedProducts, id]);
    }
};

const handleBulkDelete = async () => {
    try {
    const token = localStorage.getItem("adminToken");
    await axios.delete("http://localhost:5000/api/products", {
        headers: {
        Authorization: `Bearer ${token}`,
        },
        data: {
        productIds: selectedProducts,
        },
    });

    setProducts(products.filter((p) => !selectedProducts.includes(p._id)));
    setSelectedProducts([]);
    setShowBulkModal(false);
    } catch (err) {
    alert("خطا در حذف محصولات.");
    console.error(err);
    }
};

return (
    <div className="container py-10 mx-auto">
    <h2 className="mb-6 text-3xl font-bold">مدیریت محصولات</h2>

      {/* فرم فیلتر + جستجو */}
    <ReusableFilterForm
        filters={filters}
        onFilterChange={setFilters}
        showRole={false}
        showDateRange={false}
        showSearchTerm={false} // چون ما یک input مستقل داریم
        showStatus={true}
        showCategory={true}
        statusOptions={[
        { value: "", label: "همه" },
        { value: "new", label: "جدید" },
        { value: "on-sale", label: "در حال فروش" },
        { value: "out-of-stock", label: "تمام شده" },
        ]}
        categories={[
        { value: "", label: "همه دسته‌ها" },
        { value: "electronics", label: "الکترونیک" },
        { value: "clothing", label: "پوشاک" },
        { value: "books", label: "کتاب" },
        { value: "home", label: "خانه و آشپزخانه" },
        { value: "others", label: "سایر" },
        ]}
    />

      {/* دکمه‌های سریع */}
    <div className="flex mb-4 space-x-4 space-x-reverse">
        {selectedProducts.length > 0 && (
        <button
            onClick={() => setShowBulkModal(true)}
            className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
        >
            حذف {selectedProducts.length} آیتم
        </button>
        )}
        <button
        onClick={() => navigate("/admin/add-product")}
        className="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600"
        >
        افزودن محصول جدید
        </button>
    </div>

    {/* جستجوی زنده */}
<div className="mb-6">
{/* <input
    type="text"
    placeholder="جستجوی محصول..."
    value={filters.searchTerm}
    onChange={(e) =>
    setFilters((prev) => ({ ...prev, searchTerm: e.target.value }))
    }
    className="w-full px-4 py-2 border rounded"
/> */}
<input
type="text"
placeholder="جستجوی محصول..."
value={debouncedSearch}
onChange={(e) => setDebouncedSearch(e.target.value)}
className="w-full px-4 py-2 border rounded"
/>
</div>

      {/* لیست محصولات */}
    {loading ? (
        <p>در حال بارگذاری...</p>
    ) : products.length === 0 ? (
        <p className="py-10 text-center text-gray-500">محصولی یافت نشد.</p>
    ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
            <div key={product._id} className="relative">
            <input
                type="checkbox"
                checked={selectedProducts.includes(product._id)}
                onChange={() => handleCheckboxChange(product._id)}
                className="absolute w-5 h-5 top-2 left-2"
            />
            <ProductCard product={product} />
            </div>
        ))}
        </div>
    )}

      {/* صفحه‌بندی */}
    <Pagination currentPage={page} totalPages={totalPages} onPageChange={(newPage) => setPage(newPage)} />

      {/* مدال حذف گروهی */}
    <BulkDeleteModal
        isOpen={showBulkModal}
        onClose={() => setShowBulkModal(false)}
        onConfirm={handleBulkDelete}
        count={selectedProducts.length}
    />

    <HasPermission permission="delete_users">
            <button className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600">
                حذف کاربران
            </button>
            </HasPermission>
    </div>
);
}