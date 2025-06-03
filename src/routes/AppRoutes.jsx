import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import ProductDetail from "../pages/ProductDetail";
import Cart from "../pages/Cart";
import Wishlist from "../pages/Wishlist";
import Login from "../pages/Login";
import Register from "../pages/Register";
import AdminPanel from "../pages/AdminPanel";
import PaymentPage from "../pages/PaymentPage";
import VerifyPayment from "../pages/VerifyPayment";
import OrdersPage from "../pages/OrdersPage";
import OrderDetailPage from "../pages/OrderDetailPage";
import AdminOrdersPage from "../pages/AdminOrdersPage";
import AdminOrderDetailPage from "../pages/AdminOrderDetailPage";
export default function AppRoutes() {
return (
    <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/product/:id" element={<ProductDetail />} />
    <Route path="/cart" element={<Cart />} />
    <Route path="/wishlist" element={<Wishlist />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/admin" element={<AdminPanel />} />
    <Route path="/payment" element={<PaymentPage />} />
    <Route path="/verify-payment" element={<VerifyPayment />} />
    <Route path="/orders" element={<OrdersPage />} />
<Route path="/orders/:id" element={<OrderDetailPage />} />
<Route path="/admin/orders" element={<AdminOrdersPage />} />
<Route path="/admin/order/:id" element={<AdminOrderDetailPage />} />
    </Routes>
);
}