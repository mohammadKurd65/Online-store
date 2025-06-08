import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";

export default function Home() {
const products = [
    { id: 1, name: "محصول اول", price: 1000000 },
    { id: 2, name: "محصول دوم", price: 2000000 },
];
const [filters, setFilters] = useState({
category: "",
priceRange: "",
inStock: false,
status: "",
});

const [products, setProducts] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
const fetchProducts = async () => {
    try {
    const params = new URLSearchParams();
    if (filters.category) params.append("category", filters.category);
    if (filters.priceRange) params.append("price", filters.priceRange);
    if (filters.inStock) params.append("inStock", true);
    if (filters.status) params.append("status", filters.status);

    const res = await axios.get(`http://localhost:5000/api/products?${params}`);
    setProducts(res.data.data);
    } catch (err) {
    console.error(err);
    } finally {
    setLoading(false);
    }
};

fetchProducts();
}, [filters]);

return (
    <div className="container py-10 mx-auto">
    <h1 className="mb-6 text-3xl font-bold">محصولات</h1>
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
{products.map(product => (
    <ProductCard key={product.id} product={product} />
))}
</div>
    <ProductFilterForm filters={filters} onFilterChange={setFilters} />
     {/* لیست محصولات */}
<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
    {products.map((product) => (
    <ProductCard key={product._id} product={product} />
    ))}
</div>
    </div>
);
}