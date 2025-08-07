import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const UserRegister = () => {
const [name, setName] = useState('');
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [confirmPassword, setConfirmPassword] = useState('');
const [error, setError] = useState('');
const [success, setSuccess] = useState('');
const navigate = useNavigate();

const handleSubmit = async (e) => {
    e.preventDefault();
    
    // اعتبارسنجی فرم
    if (password !== confirmPassword) {
    setError('رمز عبور و تکرار آن یکسان نیستند');
    return;
    }
    
    if (password.length < 6) {
    setError('رمز عبور باید حداقل 6 کاراکتر باشد');
    return;
    }
    
    try {
      // اینجا باید درخواست واقعی به API بفرستید
      // برای مثال:
      // const response = await axios.post('/api/user/register', { name, email, password });
    
      // برای تست موقت، فرض می‌کنیم ثبت‌نام موفقیت‌آمیز بوده
    setSuccess('ثبت‌نام با موفقیت انجام شد! وارد شوید.');
    setError('');
    
      // پس از 2 ثانیه به صفحه ورود هدایت شوید
    setTimeout(() => {
        navigate('/user/login');
    }, 2000);
    
    } catch (err) {
    setError('خطا در ثبت‌نام. لطفاً دوباره تلاش کنید.');
    }
};

return (
    <div className="flex items-center justify-center min-h-screen px-4 py-12 bg-gray-50 sm:px-6 lg:px-8">
    <div className="w-full max-w-md space-y-8">
        <div>
        <h2 className="mt-6 text-3xl font-extrabold text-center text-gray-900">
            ثبت‌نام در علی‌بابا کلون
        </h2>
        <p className="mt-2 text-sm text-center text-gray-600">
            حساب کاربری جدید ایجاد کنید
        </p>
        </div>
        
        {error && (
        <div className="relative px-4 py-3 text-red-700 bg-red-100 border border-red-400 rounded" role="alert">
            <span className="block sm:inline">{error}</span>
        </div>
        )}
        
        {success && (
        <div className="relative px-4 py-3 text-green-700 bg-green-100 border border-green-400 rounded" role="alert">
            <span className="block sm:inline">{success}</span>
        </div>
        )}
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div className="-space-y-px rounded-md shadow-sm">
            <div>
            <label htmlFor="name" className="sr-only">نام و نام خانوادگی</label>
            <input
                id="name"
                name="name"
                type="text"
                required
                className="relative block w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-none appearance-none rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="نام و نام خانوادگی"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            </div>
            <div>
            <label htmlFor="email-address" className="sr-only">آدرس ایمیل</label>
            <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="relative block w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-none appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
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
                autoComplete="new-password"
                required
                className="relative block w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-none appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="رمز عبور"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            </div>
            <div>
            <label htmlFor="confirm-password" className="sr-only">تکرار رمز عبور</label>
            <input
                id="confirm-password"
                name="confirm-password"
                type="password"
                autoComplete="new-password"
                required
                className="relative block w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-none appearance-none rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="تکرار رمز عبور"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
            />
            </div>
        </div>

        <div>
            <button
            type="submit"
            className="relative flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md group hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
            ثبت‌نام
            </button>
        </div>

        <div className="text-center">
            <span className="text-gray-600">حساب کاربری دارید؟ </span>
            <a href="/user/login" className="font-medium text-indigo-600 hover:text-indigo-500">
            وارد شوید
            </a>
        </div>
        </form>
    </div>
    </div>
);
};

export default UserRegister;