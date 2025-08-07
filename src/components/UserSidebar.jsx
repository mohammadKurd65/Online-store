import React from 'react';
import { Link } from 'react-router-dom';

const UserSidebar = () => {
return (
    <div className="space-y-4">
    <h2 className="mb-4 text-xl font-bold">پنل کاربری</h2>
    
    <div className="space-y-2">
        <h3 className="font-semibold text-gray-600">پروفایل</h3>
        <ul className="pl-4">
        <li><Link to="/user/profile" className="block py-2 rounded hover:bg-gray-200">اطلاعات پروفایل</Link></li>
        <li><Link to="/user/profile/edit" className="block py-2 rounded hover:bg-gray-200">ویرایش پروفایل</Link></li>
        </ul>
    </div>
    
    <div className="space-y-2">
        <h3 className="font-semibold text-gray-600">سفارشات</h3>
        <ul className="pl-4">
        <li><Link to="/user/dashboard/orders" className="block py-2 rounded hover:bg-gray-200">سفارشات من</Link></li>
        </ul>
    </div>
    
    <div className="space-y-2">
        <h3 className="font-semibold text-gray-600">لیست‌ها</h3>
        <ul className="pl-4">
        <li><Link to="/user/dashboard/wishlist" className="block py-2 rounded hover:bg-gray-200">علاقه‌مندی‌ها</Link></li>
        <li><Link to="/user/dashboard/cart" className="block py-2 rounded hover:bg-gray-200">سبد خرید</Link></li>
        </ul>
    </div>
    
    <div className="space-y-2">
        <h3 className="font-semibold text-gray-600">تنظیمات</h3>
        <ul className="pl-4">
        <li><Link to="/user/dashboard/settings" className="block py-2 rounded hover:bg-gray-200">تنظیمات حساب</Link></li>
        </ul>
    </div>
    </div>
);
};

export default UserSidebar;