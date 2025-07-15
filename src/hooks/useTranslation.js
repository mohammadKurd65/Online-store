import { useState, useEffect } from "react";

const useTranslation = () => {
  const [lang, setLang] = useState("fa"); // زبان پیش‌فرض
const [translations, setTranslations] = useState({});

useEffect(() => {
    import(`../locales/${lang}.json`).then((res) => {
    setTranslations(res.default);
    });
}, [lang]);

return { t: translations, lang, setLang };
};

export default useTranslation;