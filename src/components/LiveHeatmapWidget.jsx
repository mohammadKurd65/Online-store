import React, { useRef, useState, useEffect } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "leaflet.heat";
import Slider from "react-slider";
import moment from "moment-jalaali";
import "moment-jalaali/locale/fa";
import { io } from "socket.io-client";

export default function LiveHeatmapWidget({ token, historicalLogs = [] }) {
const mapRef = useRef(null);
const heatmapLayerRef = useRef(null);
  const animationRef = useRef(null); // برای مدیریت انیمیشن
const [dataPoints, setDataPoints] = useState([]);
const [timeRange, setTimeRange] = useState([0, Date.now()]);
const [currentTimeLabel, setCurrentTimeLabel] = useState("همه زمان‌ها");
const [isPlaying, setIsPlaying] = useState(false);
const [animationSpeed, setAnimationSpeed] = useState(500); // میلی‌ثانیه
const [currentWindow, setCurrentWindow] = useState([0, 0]);
const defaultCenter = [32.4279, 53.6880]; // مرکز ایران

  // ✅ اولیه‌سازی با داده‌های تاریخی
useEffect(() => {
    const points = historicalLogs
    .filter(log => log.latitude && log.longitude)
    .map(log => ({
        lat: log.latitude,
        lng: log.longitude,
        intensity: 1,
        timestamp: new Date(log.viewedAt).getTime()
    }));

    setDataPoints(points);
    initializeTimeRange(points);
}, [historicalLogs, setDataPoints, setTimeRange, setCurrentTimeLabel, setCurrentWindow]);

  // ✅ اتصال به WebSocket برای داده‌های زنده
useEffect(() => {
    const socket = io("http://localhost:5000");
    
    socket.on("new_view", (data) => {
    if (data.token === token && data.latitude && data.longitude) {
        const newPoint = {
        lat: data.latitude,
        lng: data.longitude,
        intensity: 1,
        timestamp: Date.now()
        };
        
        setDataPoints(prev => [...prev, newPoint]);
    }
    });

    return () => socket.disconnect();
}, [token, setDataPoints, defaultCenter, historicalLogs, setCurrentTimeLabel, setCurrentWindow]);

  // ✅ تنظیم محدوده زمانی اولیه
const initializeTimeRange = (points) => {
    if (points.length === 0) {
    const now = Date.now();
      setTimeRange([now - 24 * 60 * 60 * 1000, now]);
      setCurrentWindow([now - 24 * 60 * 60 * 1000, now]);
    setCurrentTimeLabel("آخر 24 ساعت");
    return;
    }

    const minTime = Math.min(...points.map(p => p.timestamp));
    const maxTime = Math.max(...points.map(p => p.timestamp));
    setTimeRange([minTime, maxTime]);
    setCurrentWindow([minTime, minTime + (maxTime - minTime) * 0.1]); // 10% اول
};

  // ✅ فیلتر داده‌ها بر اساس محدوده زمانی
const getFilteredPoints = () => {
    return dataPoints.filter(point => 
    point.timestamp >= currentWindow[0] && point.timestamp <= currentWindow[1]
    ).map(point => [point.lat, point.lng, point.intensity]);
};

  // ✅ به‌روزرسانی نقشه
useEffect(() => {
    if (!mapRef.current) {
      // 1️⃣ ساخت نقشه
    const map = L.map("heatmap-map").setView(defaultCenter, 5);
    mapRef.current = map;

      // 2️⃣ اضافه کردن لایه نقشه پایه
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

      // 3️⃣ ایجاد لایه heatmap
    const heatmapLayer = L.heatLayer([], {
        radius: 25,
        blur: 15,
        maxZoom: 18,
        gradient: {
        0.1: "blue",
        0.3: "lime",
        0.5: "yellow",
        0.7: "orange",
        1.0: "red",
        },
    }).addTo(map);

    heatmapLayerRef.current = heatmapLayer;
    }

    // 4️⃣ به‌روزرسانی داده‌های heatmap
    if (heatmapLayerRef.current) {
    const filteredPoints = getFilteredPoints();
    heatmapLayerRef.current.setLatLngs(filteredPoints);
    }

}, [currentWindow, dataPoints, defaultCenter, setDataPoints, setCurrentTimeLabel, setCurrentWindow]);

  // ✅ محاسبه برچسب زمان
const getTimeLabel = (timestamp) => {
    return moment(timestamp).format("jYYYY/jMM/jDD HH:mm");
};

  // ✅ تنظیم برچسب زمانی
useEffect(() => {
    if (currentWindow[0] === 0) {
    setCurrentTimeLabel("همه زمان‌ها");
    } else {
      const hoursDiff = Math.floor((currentWindow[1] - currentWindow[0]) / (60 * 60 * 1000));
    if (hoursDiff <= 1) {
        setCurrentTimeLabel("1 ساعت");
    } else {
        setCurrentTimeLabel(`${getTimeLabel(currentWindow[0])}`);
    }
    }
}, [currentWindow, setCurrentTimeLabel, setCurrentWindow, setDataPoints, setTimeRange, setCurrentWindow]);

  // ✅ تابع پخش خودکار
const startAnimation = () => {
    setIsPlaying(true);
    
    // پاک کردن انیمیشن قبلی
    if (animationRef.current) clearInterval(animationRef.current);
    
    // محاسبه گام‌ها
    const totalRange = timeRange[1] - timeRange[0];
    const windowSize = currentWindow[1] - currentWindow[0];
    const step = Math.max(3600000, totalRange / 50); // 1 ساعت یا 1/50 کل بازه
    
    animationRef.current = setInterval(() => {
    setCurrentWindow(prev => {
        const newStart = prev[0] + step;
        const newEnd = newStart + windowSize;
        
        if (newEnd >= timeRange[1]) {
          // پایان انیمیشن
        clearInterval(animationRef.current);
        setIsPlaying(false);
        return [timeRange[1] - windowSize, timeRange[1]];
        }
        
        return [newStart, newEnd];
    });
    }, animationSpeed);
};

  // ✅ توقف پخش
const stopAnimation = () => {
    if (animationRef.current) {
    clearInterval(animationRef.current);
    animationRef.current = null;
    }
    setIsPlaying(false);
};

  // ✅ پاک کردن هنگام unmount
useEffect(() => {
    return () => {
    stopAnimation();
    };
}, [ setIsPlaying, setCurrentWindow, setDataPoints, setTimeRange]);

  // ✅ تغییر سرعت
const changeSpeed = (speed) => {
    setAnimationSpeed(speed);
    if (isPlaying) {
    stopAnimation();
    startAnimation();
    }
};

return (
    <div className="p-6 mb-8 bg-white rounded shadow">
    <h3 className="mb-4 text-xl font-semibold">نقشه گرمایی بازدیدکنندگان</h3>
    
      {/* کنترل پخش خودکار */}
    <div className="flex items-center justify-between mb-6">
        <div className="flex space-x-2 space-x-reverse">
        <button
            onClick={isPlaying ? stopAnimation : startAnimation}
            className={`w-10 h-10 rounded-full flex items-center justify-center ${
            isPlaying ? "bg-red-500" : "bg-green-500"
            } text-white hover:opacity-90`}
        >
            {isPlaying ? "■" : "▶"}
        </button>
        
        <div className="flex items-center space-x-1">
            <span className="text-sm">سرعت:</span>
            <select
            value={animationSpeed}
            onChange={(e) => changeSpeed(parseInt(e.target.value))}
            className="px-2 py-1 text-sm border rounded"
            >
            <option value={1000}>آهسته (1s)</option>
            <option value={500}>معمولی (0.5s)</option>
            <option value={250}>سریع (0.25s)</option>
            </select>
        </div>
        </div>
        
        <div className="text-right">
        <span className="font-medium">بازه فعال: {currentTimeLabel}</span>
        </div>
    </div>

      {/* اسلایدر زمانی */}
    <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
        <span className="font-medium">بازه کلی زمانی</span>
        <button
            onClick={() => {
            const now = Date.now();
              setTimeRange([now - 24 * 60 * 60 * 1000, now]);
              setCurrentWindow([now - 24 * 60 * 60 * 1000, now]);
            }}
            className="px-3 py-1 text-sm text-white bg-blue-500 rounded hover:bg-blue-600"
        >
            آخر 24 ساعت
        </button>
        </div>
        
        <Slider
          min={dataPoints.length > 0 ? Math.min(...dataPoints.map(p => p.timestamp)) : Date.now() - 7 * 24 * 60 * 60 * 1000}
        max={Date.now()}
        value={timeRange}
        onChange={setTimeRange}
        pearling
          minDistance={60 * 60 * 1000} // حداقل فاصله: 1 ساعت
        renderThumb={(props, state) => (
            <div {...props} className="w-4 h-4 bg-blue-500 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-300" />
        )}
        renderTrack={(props, state) => (
            <div
            {...props}
            className={`h-2 rounded ${
                state.index === 1 ? "bg-blue-500" : "bg-gray-300"
            }`}
            />
        )}
        />
        
        <div className="flex justify-between mt-2 text-xs text-gray-500">
        <span>{dataPoints.length > 0 ? getTimeLabel(timeRange[0]) : "—"}</span>
        <span>{getTimeLabel(timeRange[1])}</span>
        </div>
    </div>

      {/* نقشه */}
    <div 
        id="heatmap-map" 
        className="overflow-hidden rounded h-96"
        style={{ minHeight: "400px" }}
    ></div>

      {/* راهنما */}
    <div className="flex items-center justify-between mt-4">
        <div className="flex items-center space-x-2 space-x-reverse">
        <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
        <span className="text-sm">کم‌ترین تراکم</span>
        <div className="w-4 h-4 mx-2 bg-green-500 rounded-full"></div>
        <div className="w-4 h-4 mx-2 bg-yellow-500 rounded-full"></div>
        <div className="w-4 h-4 mx-2 bg-orange-500 rounded-full"></div>
        <div className="w-4 h-4 bg-red-500 rounded-full"></div>
        <span className="text-sm">بیشترین تراکم</span>
        </div>
        <span className="text-sm text-gray-500">
        {getFilteredPoints().length} بازدید در این بازه
        </span>
    </div>
    </div>
);
}