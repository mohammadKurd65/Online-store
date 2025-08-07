import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { decodeToken } from '../../utils/jwtDecode';

const UserProfileOverview = () => {
const { currentUser } = useAuth();
const token = localStorage.getItem('userToken');
const decoded = decodeToken(token);
const userRole = decoded?.role;

const [userDetails, setUserDetails] = useState({
    name: 'علی محمدی',
    email: 'ali@example.com',
    phone: '09123456789',
    address: 'تهران، خیابان آزادی، پلاک 123',
    joinDate: '1402/05/10'
});

const [loading, setLoading] = useState(true);

useEffect(() => {
    // در شرایط واقعی، این داده‌ها از API دریافت می‌شوند
    // برای تست، داده‌های ساختگی ایجاد می‌کنیم
    setTimeout(() => {
    setLoading(false);
    }, 500);
}, []);

if (loading) {
    return (
    <div className="container px-4 py-8 mx-auto">
        <div className="max-w-3xl p-6 mx-auto bg-white rounded-lg shadow">
        <div className="animate-pulse">
            <div className="w-1/4 h-8 mb-6 bg-gray-200 rounded"></div>
            <div className="space-y-4">
            <div className="w-3/4 h-4 bg-gray-200 rounded"></div>
            <div className="w-1/2 h-4 bg-gray-200 rounded"></div>
            <div className="w-2/3 h-4 bg-gray-200 rounded"></div>
            <div className="w-1/3 h-4 bg-gray-200 rounded"></div>
            </div>
        </div>
        </div>
    </div>
    );
}

return (
    <div className="container px-4 py-8 mx-auto">
    <div className="max-w-3xl p-6 mx-auto bg-white rounded-lg shadow">
        <div className="flex items-center mb-6">
        <div className="flex items-center justify-center w-20 h-20 mr-4 text-2xl font-bold text-gray-600 bg-gray-200 rounded-full">
            {userDetails.name.charAt(0)}
        </div>
        <div>
            <h1 className="text-2xl font-bold">{userDetails.name}</h1>
            <p className="text-gray-600">عضو از {userDetails.joinDate}</p>
        </div>
        </div>
        
        <div className="pt-6 border-t border-gray-200">
        <h2 className="mb-4 text-xl font-semibold">اطلاعات شخصی</h2>
        
        <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-2">
            <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">نام و نام خانوادگی</label>
            <p className="px-3 py-2 border border-gray-300 rounded-md bg-gray-50">{userDetails.name}</p>
            </div>
            
            <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">آدرس ایمیل</label>
            <p className="px-3 py-2 border border-gray-300 rounded-md bg-gray-50">{userDetails.email}</p>
            </div>
            
            <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">شماره تلفن</label>
            <p className="px-3 py-2 border border-gray-300 rounded-md bg-gray-50">{userDetails.phone}</p>
            </div>
            
            <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">نقش کاربری</label>
        <p className="px-3 py-2 capitalize border border-gray-300 rounded-md bg-gray-50">
                {userRole === 'admin' ? 'ادمین' : 
                userRole === 'editor' ? 'ویرایشگر' : 'کاربر عادی'}
            </p>
            </div>
        </div>
        
        <div className="mb-6">
            <label className="block mb-1 text-sm font-medium text-gray-700">آدرس</label>
            <p className="bg-gray-50 border border-gray-300 rounded-md px-3 py-2 min-h-[80px]">{userDetails.address}</p>
        </div>
        
        <div className="flex justify-end">
            <a 
            href="/user/profile/edit" 
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700"
            >
            ویرایش پروفایل
            </a>
        </div>
        </div>
        
        <div className="pt-6 mt-6 border-t border-gray-200">
        <h2 className="mb-4 text-xl font-semibold">آمار کاربری</h2>
        
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="p-4 rounded-lg bg-blue-50">
            <h3 className="text-sm font-medium text-gray-500">سفارشات انجام شده</h3>
            <p className="text-2xl font-bold text-blue-600">15</p>
            </div>
            
            <div className="p-4 rounded-lg bg-green-50">
            <h3 className="text-sm font-medium text-gray-500">محصولات مورد علاقه</h3>
            <p className="text-2xl font-bold text-green-600">24</p>
            </div>
            
            <div className="p-4 rounded-lg bg-purple-50">
            <h3 className="text-sm font-medium text-gray-500">امتیاز</h3>
            <p className="text-2xl font-bold text-purple-600">1,250</p>
            </div>
        </div>
        </div>
    </div>
    </div>
);
};

export default UserProfileOverview;