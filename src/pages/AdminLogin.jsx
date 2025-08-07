import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminLogin = () => {
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [error, setError] = useState('');
const navigate = useNavigate();
const { login } = useAuth();

const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // اینجا باید درخواست واقعی به API بفرستید
      // برای مثال:
      // const response = await axios.post('/api/admin/login', { email, password });
      // const { token } = response.data;
    
      // برای تست موقت، فرض می‌کنیم ورود موفقیت‌آمیز بوده
    const mockToken = 'admin_token_123';
    localStorage.setItem('adminToken', mockToken);
    
      // دیکد کردن توکن برای دریافت نقش کاربر
    const mockDecoded = { role: 'admin', id: 'admin_1' };
    
      // وارد کردن اطلاعات کاربر به context
    login({ 
        email, 
        role: mockDecoded.role,
        id: mockDecoded.id 
    });
    
    navigate('/admin/dashboard');
    } catch (err) {
    setError('ایمیل یا رمز عبور اشتباه است');
    }
};

return (
    <div className="flex items-center justify-center min-h-screen px-4 py-12 bg-gray-50 sm:px-6 lg:px-8">
    <div className="w-full max-w-md space-y-8">
        <div>
        <h2 className="mt-6 text-3xl font-extrabold text-center text-gray-900">
            ورود به پنل ادمین
        </h2>
        </div>
        {error && (
        <div className="relative px-4 py-3 text-red-700 bg-red-100 border border-red-400 rounded" role="alert">
            <span className="block sm:inline">{error}</span>
        </div>
        )}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <input type="hidden" name="remember" value="true" />
        <div className="-space-y-px rounded-md shadow-sm">
            <div>
            <label htmlFor="email-address" className="sr-only">آدرس ایمیل</label>
            <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="relative block w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-none appearance-none rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="آدرس ایمیل"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            </div>
            <div>
            <label htmlFor="password" className="sr-only">رمز عبور</label>
            <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="relative block w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-none appearance-none rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="رمز عبور"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            </div>
        </div>

        <div>
            <button
            type="submit"
            className="relative flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md group hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
            ورود
            </button>
        </div>
        </form>
    </div>
    </div>
);
};

export default AdminLogin;