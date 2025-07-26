import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "react-leaflet-cluster/lib/styles.css"; // CSS خوشه‌بندی
import { MarkerClusterGroup } from "react-leaflet-cluster"; // کامپوننت خوشه‌بندی
import L from "leaflet";
import { io } from "socket.io-client";


// فیکس آیکون Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
iconUrl: require("leaflet/dist/images/marker-icon.png"),
shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

export default function LiveMapWidget({ token }) {
const [views, setViews] = useState([]);
  const defaultCenter = [32.4279, 53.6880]; // مرکز ایران


useEffect(() => {
    const socket = io("http://localhost:5000");

    socket.on("new_view", (data) => {
    if (data.token === token && data.latitude && data.longitude) {
        setViews((prev) => [
        {
            id: Date.now(),
            lat: data.latitude,
            lng: data.longitude,
            city: data.city,
            country: data.country,
            time: new Date().toLocaleTimeString("fa-IR"),
        },
          ...prev.slice(0, 9), // فقط 10 بازدید اخیر
        ]);
    }
});

    return () => {
    socket.disconnect();
    };
}, [token, setViews, defaultCenter, views]);

  // ✨ تابع سفارشی برای خوشه‌ها
const createClusterCustomIcon = (cluster) => {
    return L.divIcon({
    html: `<div class="cluster-icon">${cluster.getChildCount()}</div>`,
    className: "custom-marker-cluster",
    iconSize: L.point(40, 40, true),
    });
};

return (
    <div className="p-6 mb-8 bg-white rounded shadow">
    <h3 className="mb-4 text-xl font-semibold">نقشه زنده بازدیدکنندگان</h3>
    
    <div className="overflow-hidden rounded h-96">
        <MapContainer 
        center={defaultCenter} 
        zoom={5} 
        style={{ height: "100%", width: "100%" }}
        >
        <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
          {/* ✅ خوشه‌بندی مارکرها */}
        <MarkerClusterGroup
            chunkedLoading
            maxClusterRadius={40} // فاصله خوشه‌بندی
            iconCreateFunction={createClusterCustomIcon}
        >
            {views.map((view) => (
            <Marker 
                key={view.id} 
                position={[view.lat, view.lng]}
                icon={L.icon({
                iconUrl: "/marker-icon.png",
                shadowUrl: "/marker-shadow.png",
                iconSize: [25, 41],
                })}
            >
                <Popup>
                <div className="text-sm">
                    <div className="font-medium">{view.city}, {view.country}</div>
                    <div className="text-gray-500">{view.time}</div>
                </div>
                </Popup>
            </Marker>
            ))}
        </MarkerClusterGroup>
        </MapContainer>
    </div>

      {/* لیست بازدیدها */}
    <div className="mt-4 overflow-y-auto max-h-40">
        <h4 className="mb-2 font-semibold">بازدیدهای اخیر:</h4>
        <ul className="space-y-1">
        {views.map((view) => (
            <li 
            key={view.id}
            className="flex items-center justify-between p-2 text-sm rounded bg-gray-50"
            >
            <span>{view.city}, {view.country}</span>
            <span className="text-xs text-gray-500">{view.time}</span>
            </li>
        ))}
        </ul>
    </div>
    </div>
);
}