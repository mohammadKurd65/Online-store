import React from 'react';
import Navbar from '../components/Navbar';
import UserSidebar from '../components/UserSidebar';

const UserLayout = ({ children }) => {
return (
    <div className="flex flex-col min-h-screen">
    <Navbar />
    <div className="container flex flex-grow px-4 py-8 mx-auto">
        <div className="w-1/4 mr-8">
        <UserSidebar />
        </div>
        <div className="w-3/4">
        {children}
        </div>
    </div>
    </div>
);
};

export default UserLayout;