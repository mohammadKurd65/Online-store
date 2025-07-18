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
import AdminLogin from "../pages/AdminLogin";
import AdminUsersPage from "../pages/AdminUsersPage";
import AddAdminPage from "../pages/AddAdminPage";
import AdminDashboard from "../pages/AdminDashboard";
import UserLogin from "../pages/UserLogin";
import UserRegister from "../pages/UserRegister";
import UserProfilePage from "../pages/UserProfilePage";
import UserOrderDetailPage from "../pages/UserOrderDetailPage";
import UserEditProfilePage from "../pages/UserEditProfilePage";
import UserDashboardPage from "../pages/UserDashboardPage";
import AddProductPage from "../pages/AddProductPage";
import AdminProductsPage from "../pages/AdminProductsPage";
import AdminProductDetailPage from "../pages/AdminProductDetailPage";
import EditProductPage from "../pages/EditProductPage";
import AdminProductDashboard from "../pages/AdminProductDashboard";
import AdminDashboardPage from "../pages/AdminDashboardPage";
import AdminUserManagementPage from "../pages/AdminUserManagementPage";
import AdminEditUserPage from "../pages/AdminEditUserPage";
import AdminAddUserPage from "../pages/AdminAddUserPage";
import AdminFullDashboardPage from "../pages/AdminFullDashboardPage";
// import { Navigate } from "react-router-dom";
import UserDashboard from "../pages/UserDashboard";
import EditorDashboardPage from "../pages/EditorDashboardPage";
import UnauthorizedPage from "../pages/UnauthorizedPage";
import DashboardSettingsPage from "../pages/DashboardSettingsPage";
import { ProtectedRoute } from "../pages/ProtectedRoute";
import { RoleBasedRoute } from "../pages/RoleBasedRoute";
import PermissionManagementPage from "../pages/PermissionManagementPage";
import AuditLogPage from "../pages/AuditLogPage";
import NotificationsPage from "../pages/NotificationsPage";
import NotificationSettingsPage from "../pages/NotificationSettingsPage";




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
<Route path="/admin/login" element={<AdminLogin />} />
<Route path="/admin/users" element={<AdminUsersPage />} />
<Route path="*" element={<h1>404 not found</h1>}/>
<Route path="/admin/add-admin" element={<AddAdminPage />} />
<Route path="/admin" element={<AdminDashboard />} />
<Route path="/admin/dashboard" element={<AdminDashboard />} />
<Route path="/user/login" element={<UserLogin />} />
<Route path="/user/register" element={<UserRegister />} />
<Route path="/user/profile" element={<UserProfilePage />} />
<Route path="/user/profile/:id" element={<UserProfilePage />} />
<Route path="/user/profile/edit" element={<UserProfilePage />} />
<Route path="/user/profile/orders" element={<UserProfilePage />} />
<Route path="/user/profile/wishlist" element={<UserProfilePage />} />
<Route path="/user/profile/cart" element={<UserProfilePage />} />
<Route path="/user/profile/setting" element={<UserProfilePage />} />
<Route path="/user/profile/:id/edit" element={<UserProfilePage />} />
<Route path="/user/profile/:id/orders" element={<UserProfilePage />} />
<Route path="/user/profile/:id/wishlist" element={<UserProfilePage />} />
<Route path="/user/profile/:id/cart" element={<UserProfilePage />} />
<Route path="/user/profile/:id/setting" element={<UserProfilePage />} />
<Route path="/user/order/:id" element={<UserOrderDetailPage />} />
<Route path="/user/edit-profile" element={<UserEditProfilePage />} />
<Route path="/user/edit-profile/:id" element={<UserEditProfilePage />} />
<Route path="/user/edit-profile/:id/orders" element={<UserEditProfilePage />} />
<Route path="/user/edit-profile/:id/wishlist" element={<UserEditProfilePage />} />
<Route path="/user/edit-profile/:id/cart" element={<UserEditProfilePage />} />
<Route path="/user/edit-profile/:id/setting" element={<UserEditProfilePage />} />
<Route path="/user/dashboard" element={<UserDashboardPage />} />
<Route path="/user/dashboard/:id" element={<UserDashboardPage />} />
<Route path="/user/dashboard/orders" element={<UserDashboardPage />} />
<Route path="/user/dashboard/wishlist" element={<UserDashboardPage />} />
<Route path="/user/dashboard/cart" element={<UserDashboardPage />} />
<Route path="/user/dashboard/setting" element={<UserDashboardPage />} />
<Route path="/user/dashboard/:id/orders" element={<UserDashboardPage />} />
<Route path="/user/dashboard/:id/wishlist" element={<UserDashboardPage />} />
<Route path="/user/dashboard/:id/cart" element={<UserDashboardPage />} />
<Route path="/user/dashboard/:id/setting" element={<UserDashboardPage />} />
<Route path="/admin/add-product" element={<AddProductPage />} />
<Route path="/admin/products" element={<AdminProductsPage />} />
<Route path="/admin/product/:id" element={<AdminProductDetailPage />} />
<Route path="/admin/edit-product/:id" element={<EditProductPage />} />
<Route path="/admin/products" element={<AdminProductDashboard />} />
<Route path="/admin" element={<AdminDashboardPage />} />
<Route path="/admin/users" element={<AdminUserManagementPage />} />
<Route path="/admin/edit-user/:id" element={<AdminEditUserPage />} />
<Route path="/admin/add-user" element={<AdminAddUserPage />} />
<Route path="/admin/dashboard" element={<AdminFullDashboardPage />} />
<Route
path="/admin/dashboard"
element={
    <ProtectedRoute>
    <RoleBasedRoute allowedRoles={["admin"]}>
        <AdminDashboardPage />
    </RoleBasedRoute>
    </ProtectedRoute>
}
/>
<Route path="/user/dashboard" element={
<ProtectedRoute>
    <UserDashboard />
</ProtectedRoute>
} />

<Route path="/admin/dashboard" element={<ProtectedRoute>
    <RoleBasedRoute allowedRoles={["admin"]}>
    <AdminFullDashboardPage />
    </RoleBasedRoute>
</ProtectedRoute>
} />

<Route path="/editor/dashboard" element={
<ProtectedRoute>
    <RoleBasedRoute allowedRoles={["admin", "editor"]}>
    <EditorDashboardPage />
    </RoleBasedRoute>
</ProtectedRoute>
} />

<Route
path="/admin/dashboard/settings"
element={
    <ProtectedRoute>
    <RoleBasedRoute allowedRoles={["admin"]}>
        <DashboardSettingsPage />
    </RoleBasedRoute>
    </ProtectedRoute>
}
/>

<Route
path="/admin/permissions"
element={
    <ProtectedRoute>
    <RoleBasedRoute allowedRoles={["admin"]}>
        <PermissionManagementPage />
    </RoleBasedRoute>
    </ProtectedRoute>
}
/>

<Route
path="/admin/logs"
element={
    <ProtectedRoute>
    <RoleBasedRoute allowedRoles={["admin"]}>
        <AuditLogPage />
    </RoleBasedRoute>
    </ProtectedRoute>
}
/>

<Route
path="/admin/notifications"
element={
    <ProtectedRoute>
    <RoleBasedRoute allowedRoles={["admin"]}>
        <NotificationsPage />
    </RoleBasedRoute>
    </ProtectedRoute>
}
/>

<Route
path="/admin/notification/settings"
element={
    <ProtectedRoute>
    <RoleBasedRoute allowedRoles={["admin"]}>
        <NotificationSettingsPage />
    </RoleBasedRoute>
    </ProtectedRoute>
}
/>

<Route path="/unauthorized" element={<UnauthorizedPage />} />
    </Routes>
);
}