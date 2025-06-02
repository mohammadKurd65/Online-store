import { useFormik } from 'formik';
import * as Yup from 'yup';

export default function Register() {
    const formik = useFormik({
        initialValues: {
            fullName: '',
            email: '',
            password: ''
        },
        validationSchema: Yup.object({
            fullName: Yup.string()
                .required('لطفا نام کامل خود را وارد کنید')
                .min(3, 'نام باید حداقل 3 کاراکتر باشد'),
            email: Yup.string()
                .email('ایمیل نامعتبر است')
                .required('لطفا ایمیل خود را وارد کنید'),
            password: Yup.string()
                .required('لطفا رمز عبور را وارد کنید')
                .min(8, 'رمز عبور باید حداقل 8 کاراکتر باشد')
        }),
        onSubmit: values => {
            console.log(values);
            // Handle form submission here
        }
    });

    return (
        <div className="container py-10 mx-auto">
            <h2 className="mb-4 text-2xl font-bold">ثبت‌نام</h2>
            <form className="max-w-md mx-auto" onSubmit={formik.handleSubmit}>
                <div className="mb-4">
                    <label className="block mb-2 text-gray-700">نام کامل</label>
                    <input
                        type="text"
                        name="fullName"
                        className={`w-full px-3 py-2 border rounded ${formik.errors.fullName && formik.touched.fullName ? 'border-red-500' : ''}`}
                        {...formik.getFieldProps('fullName')}
                    />
                    {formik.touched.fullName && formik.errors.fullName ? (
                        <div className="mt-1 text-red-500">{formik.errors.fullName}</div>
                    ) : null}
                </div>

                <div className="mb-4">
                    <label className="block mb-2 text-gray-700">ایمیل</label>
                    <input
                        type="email"
                        name="email"
                        className={`w-full px-3 py-2 border rounded ${formik.errors.email && formik.touched.email ? 'border-red-500' : ''}`}
                        {...formik.getFieldProps('email')}
                    />
                    {formik.touched.email && formik.errors.email ? (
                        <div className="mt-1 text-red-500">{formik.errors.email}</div>
                    ) : null}
                </div>

                <div className="mb-4">
                    <label className="block mb-2 text-gray-700">رمز عبور</label>
                    <input
                        type="password"
                        name="password"
                        className={`w-full px-3 py-2 border rounded ${formik.errors.password && formik.touched.password ? 'border-red-500' : ''}`}
                        {...formik.getFieldProps('password')}
                    />
                    {formik.touched.password && formik.errors.password ? (
                        <div className="mt-1 text-red-500">{formik.errors.password}</div>
                    ) : null}
                </div>

                <button 
                    type="submit" 
                    className="w-full px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600"
                >
                    ثبت‌نام
                </button>
            </form>
        </div>
    );
}