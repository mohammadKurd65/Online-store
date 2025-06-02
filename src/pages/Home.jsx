import { Link } from "react-router-dom";

export default function Home() {
const products = [
    { id: 1, name: "محصول اول", price: 1000000 },
    { id: 2, name: "محصول دوم", price: 2000000 },
];

return (
    <div className="container py-10 mx-auto">
    <h1 className="mb-6 text-3xl font-bold">محصولات</h1>
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
        {products.map(product => (
        <div key={product.id} className="overflow-hidden transition border rounded-lg shadow hover:shadow-lg">
            <img src="https://via.placeholder.com/300x200"  alt={product.name} className="object-cover w-full h-48" />
            <div className="p-4">
            <h2 className="text-xl font-semibold">{product.name}</h2>
            <p className="text-gray-600">{product.price.toLocaleString()} تومان</p>
            <Link to={`/product/${product.id}`}>
                <button className="w-full px-4 py-2 mt-4 text-white bg-blue-500 rounded hover:bg-blue-600">
                مشاهده جزئیات
                </button>
            </Link>
            </div>
        </div>
        ))}
    </div>
    </div>
);
}