import { Navigate } from 'react-router-dom';

// 🔐 ProtectedRoute - فقط کاربران لاگین‌کرده
export const ProtectedRoute = ({ children }) => {
const token = localStorage.getItem("userToken");
if (!token) {
    return <Navigate to="/login" replace />;
}
return children;
};