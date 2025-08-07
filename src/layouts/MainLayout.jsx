import React from 'react';
import Navbar from '../components/Navbar';

const MainLayout = ({ children }) => {
return (
    <div className="flex flex-col min-h-screen">
    <Navbar />
    <main className="container flex-grow px-4 py-8 mx-auto">
        {children}
    </main>
    <footer className="py-4 text-center bg-gray-100">
        <p>© {new Date().getFullYear()} علی‌بابا کلون. تمامی حقوق محفوظ است.</p>
    </footer>
    </div>
);
};

export default MainLayout;