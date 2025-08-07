import React from 'react';
import { Link } from 'react-router-dom';

const AdminSidebar = () => {
return (
    <div className="space-y-4">
    <h2 className="mb-4 text-xl font-bold">پنل ادمین</h2>
    
    <div className="space-y-2">
        <h3 className="font-semibold text-gray-600">داشبورد</h3>
        <ul className="pl-4">
        <li><Link to="/admin/dashboard" className="block py-2 rounded hover:bg-gray-200">داشبورد اصلی</Link></li>
        </ul>
    </div>
    
    <div className="space-y-2">
        <h3 className="font-semibold text-gray-600">سفارشات</h3>
        <ul className="pl-4">
        <li><Link to="/admin/orders" className="block py-2 rounded hover:bg-gray-200">مدیریت سفارشات</Link></li>
        </ul>
    </div>
    
    <div className="space-y-2">
        <h3 className="font-semibold text-gray-600">محصولات</h3>
        <ul className="pl-4">
        <li><Link to="/admin/products" className="block py-2 rounded hover:bg-gray-200">مدیریت محصولات</Link></li>
        <li><Link to="/admin/products/add" className="block py-2 rounded hover:bg-gray-200">افزودن محصول</Link></li>
        </ul>
    </div>
    
    <div className="space-y-2">
        <h3 className="font-semibold text-gray-600">کاربران</h3>
        <ul className="pl-4">
        <li><Link to="/admin/users" className="block py-2 rounded hover:bg-gray-200">مدیریت کاربران</Link></li>
        <li><Link to="/admin/users/add" className="block py-2 rounded hover:bg-gray-200">افزودن کاربر</Link></li>
        <li><Link to="/admin/admins" className="block py-2 rounded hover:bg-gray-200">مدیریت ادمین‌ها</Link></li>
        </ul>
    </div>
    
    <div className="space-y-2">
        <h3 className="font-semibold text-gray-600">گزارش‌گیری</h3>
        <ul className="pl-4">
        <li><Link to="/admin/reports" className="block py-2 rounded hover:bg-gray-200">داشبورد گزارش‌ها</Link></li>
        <li><Link to="/admin/reports/manage" className="block py-2 rounded hover:bg-gray-200">مدیریت گزارش‌ها</Link></li>
        <li><Link to="/admin/reports/tag-stats" className="block py-2 rounded hover:bg-gray-200">آمار تگ‌ها</Link></li>
        </ul>
    </div>
    
    <div className="space-y-2">
        <h3 className="font-semibold text-gray-600">اعلان‌ها</h3>
        <ul className="pl-4">
        <li><Link to="/admin/notifications" className="block py-2 rounded hover:bg-gray-200">مدیریت اعلان‌ها</Link></li>
        <li><Link to="/admin/notifications/persistent-manager" className="block py-2 rounded hover:bg-gray-200">اعلان‌های دائمی</Link></li>
        </ul>
    </div>
    </div>
);
};

export default AdminSidebar;