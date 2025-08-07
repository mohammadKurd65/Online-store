import React from 'react';
import Navbar from '../components/Navbar';
import AdminSidebar from '../components/AdminSidebar';

const AdminLayout = ({ children }) => {
return (
    <div className="flex flex-col min-h-screen">
    <Navbar />
    <div className="flex flex-grow">
        <div className="w-64 h-screen p-4 bg-gray-100">
        <AdminSidebar />
        </div>
        <div className="flex-1 p-6">
        {children}
        </div>
    </div>
    </div>
);
};

export default AdminLayout;