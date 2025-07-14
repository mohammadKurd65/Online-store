import { useAuth } from "./useAuth";

export function usePermission() {
const { hasPermission } = useAuth();

return {
    canViewDashboard: hasPermission("view_dashboard"),
    canEditProfile: hasPermission("edit_profile"),
    canEditProducts: hasPermission("edit_products"),
    canDeleteUsers: hasPermission("delete_users"),
    canManageOrders: hasPermission("manage_orders"),
    canManagePermissions: hasPermission("manage_permissions"),
};
}