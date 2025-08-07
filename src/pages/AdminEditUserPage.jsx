import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminEditUserPage = () => {
const { id } = useParams();
const navigate = useNavigate();
const { currentUser } = useAuth();
const [userData, setUserData] = useState({
    name: '',
    email: '',
    role: 'user',
    isActive: true,
    phone: '',
    address: ''
});
const [loading, setLoading] = useState(true);
const [error, setError] = useState('');
const [success, setSuccess] = useState('');

useEffect(() => {
    // در شرایط واقعی، این داده‌ها از API دریافت می‌شوند
    // برای تست، داده‌های ساختگی ایجاد می‌کنیم
    if (id === 'new') {
setUserData({
        name: '',
        email: '',
        role: 'user',
        isActive: true,
        phone: '',
        address: ''
    });
    setLoading(false);
    } else {
      // فرض می‌کنیم کاربر با این شناسه وجود دارد
    setUserData({
        name: 'علی محمدی',
        email: 'ali@example.com',
        role: 'user',
        isActive: true,
        phone: '09123456789',
        address: 'تهران، خیابان آزادی، پلاک 123'
    });
    setLoading(false);
    }
}, [id]);

const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUserData(prev => ({
    ...prev,
    [name]: type === 'checkbox' ? checked : value
    }));
};

const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // در شرایط واقعی، این درخواست به API ارسال می‌شود
      // برای مثال:
      // const response = await axios.put(`/api/admin/users/${id}`, userData);
    
    setSuccess(id === 'new' ? 'کاربر با موفقیت ایجاد شد!' : 'کاربر با موفقیت به‌روزرسانی شد!');
    setError('');
    
      // پس از 2 ثانیه به صفحه مدیریت کاربران هدایت شوید
    setTimeout(() => {
        navigate('/admin/users');
    }, 2000);
    } catch (err) {
    setError('خطا در ذخیره اطلاعات. لطفاً دوباره تلاش کنید.');
    console.error(err);
    }
};

if (loading) {
    return (
    <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">در حال بارگذاری...</div>
    </div>
    );
}

return (
    <div className="container px-4 py-8 mx-auto">
    <div className="max-w-3xl p-6 mx-auto bg-white rounded-lg shadow">
        <h1 className="mb-6 text-2xl font-bold">
        {id === 'new' ? 'افزودن کاربر جدید' : `ویرایش کاربر #${id}`}
        </h1>
        
        {error && (
        <div className="relative px-4 py-3 mb-4 text-red-700 bg-red-100 border border-red-400 rounded" role="alert">
            <span className="block sm:inline">{error}</span>
        </div>
        )}
        
        {success && (
        <div className="relative px-4 py-3 mb-4 text-green-700 bg-green-100 border border-green-400 rounded" role="alert">
            <span className="block sm:inline">{success}</span>
        </div>
        )}
        
        <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-2">
            <div>
            <label htmlFor="name" className="block mb-1 text-sm font-medium text-gray-700">
                نام و نام خانوادگی
            </label>
            <input
                type="text"
                id="name"
                name="name"
                value={userData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required
            />
            </div>
            
            <div>
            <label htmlFor="email" className="block mb-1 text-sm font-medium text-gray-700">
                آدرس ایمیل
            </label>
            <input
                type="email"
                id="email"
                name="email"
                value={userData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required
            />
            </div>
        </div>
        
        <div className="mb-6">
            <label htmlFor="role" className="block mb-1 text-sm font-medium text-gray-700">
            نقش کاربر
            </label>
            <select
            id="role"
            name="role"
            value={userData.role}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
            <option value="user">کاربر عادی</option>
            <option value="editor">ویرایشگر</option>
            <option value="admin">ادمین</option>
            </select>
        </div>
        
        <div className="mb-6">
            <label htmlFor="phone" className="block mb-1 text-sm font-medium text-gray-700">
            شماره تلفن
            </label>
            <input
            type="tel"
            id="phone"
            name="phone"
            value={userData.phone}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
        </div>
        
        <div className="mb-6">
            <label htmlFor="address" className="block mb-1 text-sm font-medium text-gray-700">
            آدرس
            </label>
            <textarea
            id="address"
            name="address"
            value={userData.address}
            onChange={handleChange}
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
        </div>
        
        <div className="flex items-center mb-6">
            <input
            type="checkbox"
            id="isActive"
            name="isActive"
            checked={userData.isActive}
            onChange={handleChange}
            className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            />
            <label htmlFor="isActive" className="block ml-2 text-sm text-gray-900">
            کاربر فعال باشد
            </label>
        </div>
        
        <div className="flex justify-end space-x-4 space-x-reverse">
            <button
            type="button"
            onClick={() => navigate('/admin/users')}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
            >
            لغو
            </button>
            <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700"
            >
            {id === 'new' ? 'افزودن کاربر' : 'به‌روزرسانی'}
            </button>
        </div>
        </form>
    </div>
    </div>
);
};

export default AdminEditUserPage;