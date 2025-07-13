import { useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect } from "react";
import { CartContext } from "../context/CartContext";
import { decodeToken } from "../utils/jwtDecode";

export default function ProductDetail() {
const { id } = useParams();
  const product = { id: id, name: `محصول ${id}`, price: 1000000 * id };
const { dispatch } = useContext(CartContext);
const token = localStorage.getItem("userToken");
const decoded = decodeToken(token);
const userRole = decoded?.role;
const navigate = useNavigate(); 

useEffect(() => {
  if (userRole !== "admin") {
    navigate("/unauthorized");
  }
}, [userRole, navigate]);

return (
    <div className="container p-4 mx-auto">
    <div className="max-w-md p-6 mx-auto border rounded-lg shadow">
        <img src="https://via.placeholder.com/300x300"  alt={product.name} className="object-cover w-full h-64 mb-4" />
        <h1 className="mb-2 text-2xl font-bold">{product.name}</h1>
        <p className="text-lg font-semibold text-green-600">{product.price.toLocaleString()} تومان</p>
        <button
        onClick={() => dispatch({ type: "ADD_TO_CART", payload: product })}
        className="w-full px-6 py-2 mt-4 text-white bg-green-500 rounded hover:bg-green-600"
        >
        افزودن به سبد خرید
        </button>
    </div>
    </div>
);
}