
import { decodeToken } from "../utils/jwtDecode";
import { Navigate } from "react-router-dom";
import { usePermission } from "../hooks/usePermission";
// 👥 RoleBasedRoute - بر اساس نقش
export const RoleBasedRoute = ({ children, allowedRoles = ["user"] }) => {
    const { canDeleteUsers } = usePermission();

if (canDeleteUsers) {
  // نمایش دکمه حذف
}
const token = localStorage.getItem("userToken");
const decoded = token ? decodeToken(token) : null;
const userRole = decoded?.role || "user";

if (!decoded || !allowedRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" replace />;
}

return children;
};