import { useState, useEffect } from "react";

export default function usePersistedFilter(key, initialState) {
const [filters, setFilters] = useState(() => {
    const saved = localStorage.getItem(key);
    if (saved) {
    try {
        return JSON.parse(saved);
    } catch (e) {
        console.error("خطا در خواندن LocalStorage");
    }
    }
    return initialState;
});

useEffect(() => {
    localStorage.setItem(key, JSON.stringify(filters));
}, [key, filters]);

return [filters, setFilters];
}