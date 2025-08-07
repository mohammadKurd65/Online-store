import React from 'react';
import { Link } from 'react-router-dom';

const EditorSidebar = () => {
return (
    <div className="space-y-4">
    <h2 className="mb-4 text-xl font-bold">پنل ویرایشگر</h2>
    
    <div className="space-y-2">
        <h3 className="font-semibold text-gray-600">داشبورد</h3>
        <ul className="pl-4">
        <li><Link to="/editor/dashboard" className="block py-2 rounded hover:bg-gray-200">داشبورد اصلی</Link></li>
        </ul>
    </div>
    
    <div className="space-y-2">
        <h3 className="font-semibold text-gray-600">سفارشات</h3>
        <ul className="pl-4">
        <li><Link to="/editor/orders" className="block py-2 rounded hover:bg-gray-200">مدیریت سفارشات</Link></li>
        </ul>
    </div>
    
    <div className="space-y-2">
        <h3 className="font-semibold text-gray-600">محصولات</h3>
        <ul className="pl-4">
        <li><Link to="/editor/products" className="block py-2 rounded hover:bg-gray-200">مدیریت محصولات</Link></li>
        <li><Link to="/editor/products/add" className="block py-2 rounded hover:bg-gray-200">افزودن محصول</Link></li>
        </ul>
    </div>
    
    <div className="space-y-2">
        <h3 className="font-semibold text-gray-600">گزارش‌گیری</h3>
        <ul className="pl-4">
        <li><Link to="/editor/reports" className="block py-2 rounded hover:bg-gray-200">داشبورد گزارش‌ها</Link></li>
        <li><Link to="/editor/reports/tag-stats" className="block py-2 rounded hover:bg-gray-200">آمار تگ‌ها</Link></li>
        </ul>
    </div>
    </div>
);
};

export default EditorSidebar;