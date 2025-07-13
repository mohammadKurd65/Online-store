export default function ProductList({ products }) {
return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
    {products.map((product) => (
        <div key={product._id} className="overflow-hidden transition border rounded shadow hover:shadow-md">
        <img src={product.image || "/images/placeholder.jpg"} alt={product.name} className="object-cover w-full h-40" />
        <div className="p-4">
            <h4 className="font-semibold">{product.name}</h4>
            <p className="mt-1 text-gray-600">{product.price.toLocaleString()} تومان</p>
            <a href={`/admin/edit-product/${product._id}`} className="block mt-4">
            <button className="w-full px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600">
                ویرایش
            </button>
            </a>
        </div>
        </div>
    ))}
    </div>
);
}