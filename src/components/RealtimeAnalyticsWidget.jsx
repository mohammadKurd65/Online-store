import React, { useEffect, useState } from "react";
import io from "socket.io-client";

export default function RealtimeAnalyticsWidget({ token }) {
const [liveViews, setLiveViews] = useState([]);
const [totalViews, setTotalViews] = useState(0);
const [uniqueVisitors, setUniqueVisitors] = useState(0);

useEffect(() => {
    const socket = io("http://localhost:5000");

    socket.on("new_view", (data) => {
    if (data.token === token) {
        setLiveViews(prev => [data.view, ...prev.slice(0, 4)]); // فقط 5 بازدید اخیر
        setTotalViews(data.stats.totalViews);
        setUniqueVisitors(data.stats.uniqueVisitors);
    }
    });

    return () => {
    socket.disconnect();
    };
}, [token, setLiveViews, setTotalViews, setUniqueVisitors]);

return (
    <div className="p-6 mb-8 bg-white rounded shadow">
    <h3 className="mb-4 text-xl font-semibold">آنالیز زنده بازدیدها</h3>

    <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-4 text-center rounded bg-blue-50">
        <div className="text-2xl font-bold text-blue-600">{totalViews}</div>
        <div className="text-sm text-blue-800">کل بازدیدها</div>
        </div>
        <div className="p-4 text-center rounded bg-green-50">
        <div className="text-2xl font-bold text-green-600">{uniqueVisitors}</div>
        <div className="text-sm text-green-800">بازدیدکنندگان منحصربفرد</div>
        </div>
    </div>

    <h4 className="mb-3 font-semibold">بازدیدهای اخیر (زنده):</h4>
    {liveViews.length === 0 ? (
        <p className="text-sm text-gray-500">هنوز بازدیدی ثبت نشده است.</p>
    ) : (
        <ul className="space-y-2">
        {liveViews.map((view, i) => (
            <li key={i} className="p-3 text-sm border-r-4 border-blue-500 rounded bg-gray-50">
            <div className="font-medium">{new Date(view.viewedAt).toLocaleTimeString("fa-IR")}</div>
            <div className="text-gray-600">
                {view.ip} — {view.device} — {view.browser}
            </div>
            </li>
        ))}
        </ul>
    )}
    </div>
);
}