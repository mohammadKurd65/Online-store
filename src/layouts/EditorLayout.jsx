import React from 'react';
import Navbar from '../components/Navbar';
import EditorSidebar from '../components/EditorSidebar';

const EditorLayout = ({ children }) => {
return (
    <div className="flex flex-col min-h-screen">
    <Navbar />
    <div className="flex flex-grow">
        <div className="w-64 h-screen p-4 bg-gray-100">
        <EditorSidebar />
        </div>
        <div className="flex-1 p-6">
        {children}
        </div>
    </div>
    </div>
);
};

export default EditorLayout;