import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AddAdminPage = () => {
const navigate = useNavigate();
const { currentUser } = useAuth();
const [adminData, setAdminData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    role: 'admin',
    isActive: true
});
const [error, setError] = useState('');
const [success, setSuccess] = useState('');

const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAdminData(prev => ({
    ...prev,
    [name]: type === 'checkbox' ? checked : value
    }));
};

const handleSubmit = async (e) => {
    e.preventDefault();
    
    // اعتبارسنجی فرم
    if (adminData.password !== adminData.confirmPassword) {
    setError('رمز عبور و تکرار آن یکسان نیستند');
    return;
    }
    
    if (adminData.password.length < 6) {
    setError('رمز عبور باید حداقل 6 کاراکتر باشد');
    return;
    }
    
    if (adminData.username.length < 3) {
    setError('نام کاربری باید حداقل 3 کاراکتر باشد');
    return;
    }
    
    try {
      // در شرایط واقعی، این درخواست به API ارسال می‌شود
      // برای مثال:
      // const response = await axios.post('/api/admin/admins', adminData);
    
    setSuccess('ادمین با موفقیت ایجاد شد!');
    setError('');
    
      // پس از 2 ثانیه به صفحه مدیریت ادمین‌ها هدایت شوید
    setTimeout(() => {
        navigate('/admin/admins');
    }, 2000);
    } catch (err) {
    setError('خطا در ایجاد ادمین. لطفاً دوباره تلاش کنید.');
    console.error(err);
    }
};

return (
    <div className="container px-4 py-8 mx-auto">
    <div className="max-w-2xl p-6 mx-auto bg-white rounded-lg shadow">
        <h1 className="mb-6 text-2xl font-bold">افزودن ادمین جدید</h1>
        
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
        <div className="mb-6">
            <label htmlFor="username" className="block mb-1 text-sm font-medium text-gray-700">
            نام کاربری
            </label>
            <input
            type="text"
            id="username"
            name="username"
            value={adminData.username}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            required
            minLength="3"
            />
        </div>
        
        <div className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-2">
            <div>
            <label htmlFor="password" className="block mb-1 text-sm font-medium text-gray-700">
                رمز عبور
            </label>
            <input
                type="password"
                id="password"
                name="password"
                value={adminData.password}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required
                minLength="6"
            />
            </div>
            
            <div>
            <label htmlFor="confirmPassword" className="block mb-1 text-sm font-medium text-gray-700">
                تکرار رمز عبور
            </label>
            <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={adminData.confirmPassword}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required
            />
            </div>
        </div>
        
        <div className="mb-6">
            <label htmlFor="role" className="block mb-1 text-sm font-medium text-gray-700">
            نقش
            </label>
            <select
            id="role"
            name="role"
            value={adminData.role}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              disabled // در این صفحه فقط نقش ادمین مجاز است
            >
            <option value="admin">ادمین</option>
            </select>
        </div>
        
        <div className="flex items-center mb-6">
            <input
            type="checkbox"
            id="isActive"
            name="isActive"
            checked={adminData.isActive}
            onChange={handleChange}
            className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            />
            <label htmlFor="isActive" className="block ml-2 text-sm text-gray-900">
            ادمین فعال باشد
            </label>
        </div>
        
        <div className="flex justify-end space-x-4 space-x-reverse">
            <button
            type="button"
            onClick={() => navigate('/admin/admins')}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
            >
            لغو
            </button>
            <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700"
            >
            افزودن ادمین
            </button>
        </div>
        </form>
    </div>
    </div>
);
};

export default AddAdminPage;