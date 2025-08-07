import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { decodeToken } from '../utils/jwtDecode';

const RoleBasedRoute = ({ children, allowedRoles }) => {
const location = useLocation();
const token = localStorage.getItem('adminToken') || localStorage.getItem('userToken');

if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
}

const decoded = decodeToken(token);
const userRole = decoded?.role;

if (!userRole || !allowedRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
}

return children;
};

export default RoleBasedRoute;