import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

export default function Login() {
const validationSchema = Yup.object({
    email: Yup.string()
    .email("ایمیل معتبر نیست")
    .required("ایمیل الزامی است"),
    password: Yup.string()
    .min(8, "رمز عبور باید حداقل ۸ کاراکتر باشد")
    .matches(/[A-Z]/, "رمز عبور باید حداقل یک حرف بزرگ داشته باشد")
    .matches(/[a-z]/, "رمز عبور باید حداقل یک حرف کوچک داشته باشد")
    .matches(/[0-9]/, "رمز عبور باید حداقل یک عدد داشته باشد")
    .matches(/[@$!%*?&#^()_\-+=]/, "رمز عبور باید حداقل یک کاراکتر خاص داشته باشد")
    .required("رمز عبور الزامی است"),
    gender: Yup.string()
    .oneOf(["male", "female", "other"], "لطفاً یک جنسیت معتبر انتخاب کنید")
    .required("انتخاب جنسیت الزامی است"),
});

return (
    <div className="container py-10 mx-auto">
    <h2 className="mb-4 text-2xl font-bold">ورود به حساب</h2>
    <Formik
        initialValues={{ email: "", password: "", gender: "" }}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          // ارسال فرم
        console.log(values);
        }}
    >
        <Form className="max-w-md mx-auto">
        <div className="mb-4">
            <label className="block mb-2 text-gray-700">ایمیل</label>
            <Field
            type="email"
            name="email"
            className="w-full px-3 py-2 border rounded"
            />
            <ErrorMessage
            name="email"
            component="div"
            className="mt-1 text-sm text-red-500"
            />
        </div>
        <div className="mb-4">
            <label className="block mb-2 text-gray-700">رمز عبور</label>
            <Field
            type="password"
            name="password"
            className="w-full px-3 py-2 border rounded"
            />
            <ErrorMessage
            name="password"
            component="div"
            className="mt-1 text-sm text-red-500"
            />
        </div>
        <div className="mb-4">
            <label className="block mb-2 text-gray-700">جنسیت</label>
            <div className="flex gap-4">
            <label className="flex items-center">
                <Field type="checkbox" name="gender" value="male" />
                <span className="ml-2">مرد</span>
            </label>
            <label className="flex items-center">
                <Field type="checkbox" name="gender" value="female" />
                <span className="ml-2">زن</span>
            </label>
            <label className="flex items-center">
                <Field type="checkbox" name="gender" value="other" />
                <span className="ml-2">سایر</span>
            </label>
            </div>
            <ErrorMessage
            name="gender"
            component="div"
            className="mt-1 text-sm text-red-500"
            />
        </div>
        <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-blue-500 rounded"
        >
            ورود
        </button>
        </Form>
    </Formik>
    </div>
);
}