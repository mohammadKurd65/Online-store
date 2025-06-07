import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { usePersistedFilter } from "../hooks/usePersistedFilter";

export default function Cart() {
const { state, dispatch } = useContext(CartContext);
const navigate = useNavigate();


const total = state.cart.reduce((sum, item) => sum + item.price, 0);

const handlePayment = () => {
    navigate("/payment");
};

return (
    <div className="container py-10 mx-auto">
    <h2 className="mb-4 text-2xl font-bold">سبد خرید</h2>
    {state.cart.length === 0 ? (
        <p>سبد خرید شما خالی است.</p>
    ) : (
        <div>
        {state.cart.map(item => (
            <div key={item.id} className="flex items-center justify-between py-2 border-b">
            <span>{item.name}</span>
            <span>{item.price.toLocaleString()} تومان</span>
            <button
                onClick={() => dispatch({ type: "REMOVE_FROM_CART", payload: item })}
                className="text-red-500"
            >
                حذف
            </button>
            </div>
        ))}
        <div className="mt-4 text-xl font-semibold">
            جمع کل: {total.toLocaleString()} تومان
        </div>
        <button
            onClick={handlePayment}
            className="w-full px-6 py-2 mt-4 text-white bg-green-500 rounded hover:bg-green-600"
        >
            پرداخت
        </button>
        </div>
    )}
    </div>
);
}