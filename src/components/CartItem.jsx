import React from 'react';
import { useDispatch } from 'react-redux';
import { addToCart, decreaseQuantity, removeFromCart } from '../redux/cartSlice';
import { decodeToken } from "../utils/jwtDecode";
const CartItem = ({ item }) => {
    const dispatch = useDispatch();

    const handleIncrease = () => {
        dispatch(addToCart(item));
    };

    const handleDecrease = () => {
        dispatch(decreaseQuantity(item));
    };

    const handleRemove = () => {
        dispatch(removeFromCart(item.id));
    };
const token = localStorage.getItem("userToken");
const decoded = decodeToken(token);
const userRole = decoded?.role;

if (userRole !== "admin") {
  return null; // یا یک پیام دسترسی غیرمجاز
}
    return (
        <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-4">
                <img 
                    src={item.image} 
                    alt={item.title} 
                    className="object-cover w-20 h-20"
                />
                <div>
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="text-gray-600">${item.price}</p>
                </div>
            </div>
            
            <div className="flex items-center gap-4">
                <div className="flex items-center border rounded-md">
                    <button 
                        onClick={handleDecrease}
                        className="px-3 py-1 border-r"
                    >
                        -
                    </button>
                    <span className="px-3">{item.quantity}</span>
                    <button 
                        onClick={handleIncrease}
                        className="px-3 py-1 border-l"
                    >
                        +
                    </button>
                </div>
                <button 
                    onClick={handleRemove}
                    className="text-red-500"
                >
                    Remove
                </button>
            </div>
        </div>
    );
};

export default CartItem;