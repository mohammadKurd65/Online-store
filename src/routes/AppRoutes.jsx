import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/Home";
import ProductDetail from "../pages/ProductDetail";
import Cart from "../pages/Cart";
import Wishlist from "../pages/Wishlist";
import Login from "../pages/Login";
import Register from "../pages/Register";
import PaymentPage from "../pages/PaymentPage";
import VerifyPayment from "../pages/VerifyPayment";
import OrdersPage from "../pages/OrdersPage";
import OrderDetailPage from "../pages/OrderDetailPage";
import AdminLogin from "../pages/AdminLogin";
import UserLogin from "../pages/UserLogin";
import UserRegister from "../pages/UserRegister";
import AddProductPage from "../pages/AddProductPage";
import EditProductPage from "../pages/EditProductPage";
import AdminEditUserPage from "../pages/AdminEditUserPage";
import AdminAddUserPage from "../pages/AdminAddUserPage";
import AddAdminPage from "../pages/AddAdminPage";
import DashboardSettingsPage from "../pages/DashboardSettingsPage";
import PermissionManagementPage from "../pages/PermissionManagementPage";
import AuditLogPage from "../pages/AuditLogPage";
import NotificationsPage from "../pages/NotificationsPage";
import NotificationSettingsPage from "../pages/NotificationSettingsPage";
import GlobalNotificationsPage from "../pages/GlobalNotificationsPage";
import PersistentNotificationManagerPage from "../pages/PersistentNotificationManagerPage";
import PersistentNotificationLogsPage from "../pages/PersistentNotificationLogsPage";
import PersistentNotificationLogDetailPage from "../pages/PersistentNotificationLogDetailPage";
import ReportingDashboardPage from "../pages/ReportingDashboardPage";
import ScheduledReportManagerPage from "../pages/ScheduledReportManagerPage";
import ReportManagerPage from "../pages/ReportManagerPage";
import ReportTemplateManagerPage from "../pages/ReportTemplateManagerPage";
import ReportArchivePage from "../pages/ReportArchivePage";
import TagStatisticsPage from "../pages/TagStatisticsPage";
import TagTrendsPage from "../pages/TagTrendsPage";
import TrendPredictionPage from "../pages/TrendPredictionPage";
import DataUploadPage from "../pages/DataUploadPage";
import UnauthorizedPage from "../pages/UnauthorizedPage";
import ProtectedRoute from "../components/ProtectedRoute";
import RoleBasedRoute from "../components/RoleBasedRoute";

// Layouts
import MainLayout from "../layouts/MainLayout";
import UserLayout from "../layouts/UserLayout";
import AdminLayout from "../layouts/AdminLayout";
import EditorLayout from "../layouts/EditorLayout";

// User Pages
import UserProfileOverview from "../pages/user/UserProfileOverview";
import UserEditProfilePage from "../pages/user/UserEditProfilePage";
import UserDashboardPage from "../pages/user/UserDashboardPage";
import UserOrderDetailPage from "../pages/user/UserOrderDetailPage";

// Admin Pages
import AdminDashboardPage from "../pages/admin/AdminDashboardPage";
import AdminOrdersPage from "../pages/admin/AdminOrdersPage";
import AdminOrderDetailPage from "../pages/admin/AdminOrderDetailPage";
import AdminUsersPage from "../pages/admin/AdminUsersPage";
import AdminUserManagementPage from "../pages/admin/AdminUserManagementPage";
import AdminProductsPage from "../pages/admin/AdminProductsPage";
import AdminProductDetailPage from "../pages/admin/AdminProductDetailPage";

// Editor Pages
import EditorDashboardPage from "../pages/editor/EditorDashboardPage";

export default function AppRoutes() {
return (
    <Routes>
      {/* Main Routes - Public */}
    <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="product/:id" element={<ProductDetail />} />
        <Route path="cart" element={<Cart />} />
        <Route path="wishlist" element={<Wishlist />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="payment" element={<PaymentPage />} />
        <Route path="verify-payment" element={<VerifyPayment />} />
        <Route path="orders" element={<OrdersPage />} />
        <Route path="orders/:id" element={<OrderDetailPage />} />
    </Route>

      {/* User Routes */}
    <Route path="/user" element={<UserLayout />}>
        <Route path="login" element={<UserLogin />} />
        <Route path="register" element={<UserRegister />} />
        
        <Route element={<ProtectedRoute />}>
        <Route index element={<Navigate to="profile" replace />} />
        
        <Route path="profile" element={<UserProfileOverview />}>
            <Route index element={<Navigate to="../dashboard" replace />} />
            <Route path="edit" element={<UserEditProfilePage />} />
        </Route>
        
        <Route path="dashboard" element={<UserDashboardPage />}>
            <Route index element={<Navigate to="orders" replace />} />
            <Route path="orders" element={<UserDashboardPage />} />
            <Route path="orders/:id" element={<UserOrderDetailPage />} />
            <Route path="wishlist" element={<Wishlist />} />
            <Route path="cart" element={<Cart />} />
            <Route path="settings" element={<DashboardSettingsPage />} />
        </Route>
        </Route>
    </Route>

      {/* Admin Routes */}
    <Route path="/admin" element={<ProtectedRoute />}>
        <Route element={<RoleBasedRoute allowedRoles={["admin"]} />}>
        <Route element={<AdminLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="login" element={<AdminLogin />} />
            
            <Route path="dashboard" element={<AdminDashboardPage />} />
            
            <Route path="orders">
            <Route index element={<AdminOrdersPage />} />
            <Route path=":id" element={<AdminOrderDetailPage />} />
            </Route>
            
            <Route path="products">
            <Route index element={<AdminProductsPage />} />
            <Route path=":id" element={<AdminProductDetailPage />} />
            <Route path="add" element={<AddProductPage />} />
            <Route path="edit/:id" element={<EditProductPage />} />
            </Route>
            
            <Route path="users">
            <Route index element={<AdminUserManagementPage />} />
            <Route path=":id" element={<AdminUsersPage />} />
            <Route path="add" element={<AdminAddUserPage />} />
            <Route path="edit/:id" element={<AdminEditUserPage />} />
            </Route>
            
            <Route path="admins">
            <Route index element={<AdminUserManagementPage />} />
            <Route path="add" element={<AddAdminPage />} />
            </Route>
            
            <Route path="reports">
            <Route index element={<ReportingDashboardPage />} />
            <Route path="manage" element={<ReportManagerPage />} />
            <Route path="templates" element={<ReportTemplateManagerPage />} />
            <Route path="archive" element={<ReportArchivePage />} />
            <Route path="tag-stats" element={<TagStatisticsPage />} />
            <Route path="tag-trends" element={<TagTrendsPage />} />
            <Route path="predict" element={<TrendPredictionPage />} />
            <Route path="upload" element={<DataUploadPage />} />
            <Route path="scheduled" element={<ScheduledReportManagerPage />} />
            </Route>
            
            <Route path="notifications">
            <Route index element={<NotificationsPage />} />
            <Route path="settings" element={<NotificationSettingsPage />} />
            <Route path="global" element={<GlobalNotificationsPage />} />
            <Route path="persistent-manager" element={<PersistentNotificationManagerPage />} />
            <Route path="logs">
                <Route index element={<PersistentNotificationLogsPage />} />
                <Route path=":id" element={<PersistentNotificationLogDetailPage />} />
            </Route>
            </Route>
            
            <Route path="settings" element={<DashboardSettingsPage />} />
            <Route path="permissions" element={<PermissionManagementPage />} />
            <Route path="logs" element={<AuditLogPage />} />
        </Route>
        </Route>
    </Route>

      {/* Editor Routes */}
    <Route path="/editor" element={<ProtectedRoute />}>
        <Route element={<RoleBasedRoute allowedRoles={["admin", "editor"]} />}>
        <Route element={<EditorLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<EditorDashboardPage />} />
            
            <Route path="orders">
            <Route index element={<AdminOrdersPage />} />
            <Route path=":id" element={<AdminOrderDetailPage />} />
            </Route>
            
            <Route path="products">
            <Route index element={<AdminProductsPage />} />
            <Route path=":id" element={<AdminProductDetailPage />} />
            <Route path="add" element={<AddProductPage />} />
            <Route path="edit/:id" element={<EditProductPage />} />
            </Route>
            
            <Route path="reports">
            <Route index element={<ReportingDashboardPage />} />
            <Route path="manage" element={<ReportManagerPage />} />
            <Route path="tag-stats" element={<TagStatisticsPage />} />
            <Route path="tag-trends" element={<TagTrendsPage />} />
            </Route>
        </Route>
        </Route>
    </Route>

      {/* Special Routes */}
    <Route path="/unauthorized" element={<UnauthorizedPage />} />
    <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
);
}