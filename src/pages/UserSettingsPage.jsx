// src/pages/UserSettingsPage.jsx
import useTranslation from "../hooks/useTranslation";

export default function UserSettingsPage() {
const { lang, setLang } = useTranslation();

const handleChangeLanguage = (e) => {
    const selectedLang = e.target.value;
    setLang(selectedLang);
    localStorage.setItem("app-lang", selectedLang);
};

return (
    <div className="container py-10 mx-auto">
    <h2 className="mb-4 text-2xl font-bold">تنظیمات</h2>
    <div className="p-6 bg-white rounded shadow">
        <label className="block mb-2">انتخاب زبان:</label>
        <select
        value={lang}
        onChange={handleChangeLanguage}
        className="w-full px-3 py-2 border rounded"
        >
        <option value="fa">فارسی</option>
        <option value="en">انگلیسی</option>
        </select>
    </div>
    </div>
);
}