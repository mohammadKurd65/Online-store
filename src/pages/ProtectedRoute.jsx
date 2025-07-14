import { Navigate } from 'react-router-dom';
import { usePermission } from '../hooks/usePermission';
// 🔐 ProtectedRoute - فقط کاربران لاگین‌کرده
export const ProtectedRoute = ({ children }) => {
    const { canDeleteUsers } = usePermission();

if (canDeleteUsers) {
  // نمایش دکمه حذف
}
const token = localStorage.getItem("userToken");
if (!token) {
    return <Navigate to="/login" replace />;
}
return children;
};