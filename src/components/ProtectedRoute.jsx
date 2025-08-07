import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
const location = useLocation();
const token = localStorage.getItem('adminToken') || localStorage.getItem('userToken');

if (!token) {
    // اگر توکن وجود نداشته باشد، به صفحه ورود هدایت کن
    return <Navigate to="/login" state={{ from: location }} replace />;
}

return children;
};

export default ProtectedRoute;