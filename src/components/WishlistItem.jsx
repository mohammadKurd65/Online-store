import React from 'react';
import { useDispatch } from 'react-redux';
import { removeFromWishlist } from '../redux/wishlistSlice';
import { addToCart } from '../redux/cartSlice';
import { decodeToken } from "../utils/jwtDecode";

const WishlistItem = ({ item }) => {
    const dispatch = useDispatch();

    const handleRemoveFromWishlist = () => {
        dispatch(removeFromWishlist(item.id));
    };

    const handleMoveToCart = () => {
        dispatch(addToCart(item));
        dispatch(removeFromWishlist(item.id));
    };
const token = localStorage.getItem("userToken");
const decoded = decodeToken(token);
const userRole = decoded?.role;

if (userRole !== "admin") {
  return null; // یا یک پیام دسترسی غیرمجاز
}
    return (
        <div className="wishlist-item">
            <img src={item.image} alt={item.title} className="wishlist-item-image" />
            <div className="wishlist-item-details">
                <h3>{item.title}</h3>
                <p className="price">${item.price}</p>
                <div className="wishlist-item-actions">
                    <button onClick={handleMoveToCart}>Add to Cart</button>
                    <button onClick={handleRemoveFromWishlist}>Remove</button>
                </div>
            </div>
        </div>
    );
};

export default WishlistItem;