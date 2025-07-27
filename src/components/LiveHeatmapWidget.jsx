import React, { useRef, useState, useEffect } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "leaflet.heat";
import Slider from "react-slider";
import moment from "moment-jalaali";
import "moment-jalaali/locale/fa";
import { io } from "socket.io-client";
import html2canvas from "html2canvas";
import Whammy from "whammy";

export default function LiveHeatmapWidget({ token, historicalLogs = [] }) {
  const mapRef = useRef(null);
  const heatmapLayerRef = useRef(null);
  const animationRef = useRef(null);
  const [dataPoints, setDataPoints] = useState([]);
  const [timeRange, setTimeRange] = useState([0, Date.now()]);
  const [currentTimeLabel, setCurrentTimeLabel] = useState("همه زمان‌ها");
  const [isPlaying, setIsPlaying] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(500);
  const [currentWindow, setCurrentWindow] = useState([0, 0]);
  const [loopEnabled, setLoopEnabled] = useState(false);
  const defaultCenter = [32.4279, 53.6880];
  const [selectedResolution, setSelectedResolution] = useState("medium");
  // واترمارک
  const [watermarkEnabled, setWatermarkEnabled] = useState(true);
  const [watermarkText, setWatermarkText] = useState("سیستم مدیریت گزارش");
  const [watermarkPosition, setWatermarkPosition] = useState("bottom-right");
  const [watermarkOpacity, setWatermarkOpacity] = useState(0.5);
  const [watermarkIncludeTime, setWatermarkIncludeTime] = useState(true);

  // فقط یک بار تعریف تابع واترمارک
  const addWatermarkToCanvas = (canvas, timestamp) => {
    if (!watermarkEnabled) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const finalText = watermarkIncludeTime && timestamp
      ? `${watermarkText} - ${getTimeLabel(timestamp)}`
      : watermarkText;
    ctx.font = "24px Tahoma, Arial, sans-serif";
    ctx.fillStyle = `rgba(255, 255, 255, ${watermarkOpacity})`;
    let x, y;
    const padding = 20;
    switch (watermarkPosition) {
      case "top-left":
        ctx.textAlign = "left";
        ctx.textBaseline = "top";
        x = padding;
        y = padding + 24;
        break;
      case "top-right":
        ctx.textAlign = "right";
        ctx.textBaseline = "top";
        x = canvas.width - padding;
        y = padding + 24;
        break;
      case "bottom-left":
        ctx.textAlign = "left";
        ctx.textBaseline = "bottom";
        x = padding;
        y = canvas.height - padding;
        break;
      default: // bottom-right
        ctx.textAlign = "right";
        ctx.textBaseline = "bottom";
        x = canvas.width - padding;
        y = canvas.height - padding;
    }
    ctx.fillText(finalText, x, y);
  };

  // اولیه‌سازی با داده‌های تاریخی
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
    // eslint-disable-next-line
  }, [historicalLogs]);

  // اتصال به WebSocket برای داده‌های زنده
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
  }, [token]);

  // تنظیم محدوده زمانی اولیه
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
    setCurrentWindow([minTime, minTime + (maxTime - minTime) * 0.1]);
  };

  // فیلتر داده‌ها بر اساس محدوده زمانی
  const getFilteredPoints = () => {
    return dataPoints.filter(point =>
      point.timestamp >= currentWindow[0] && point.timestamp <= currentWindow[1]
    ).map(point => [point.lat, point.lng, point.intensity]);
  };

  // به‌روزرسانی نقشه
  useEffect(() => {
    if (!mapRef.current) {
      const map = L.map("heatmap-map").setView(defaultCenter, 5);
      mapRef.current = map;
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);
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
    if (heatmapLayerRef.current) {
      const filteredPoints = getFilteredPoints();
      heatmapLayerRef.current.setLatLngs(filteredPoints);
    }
  }, [currentWindow, dataPoints, defaultCenter]);

  // محاسبه برچسب زمان
  const getTimeLabel = (timestamp) => {
    return moment(timestamp).format("jYYYY/jMM/jDD HH:mm");
  };

  // تنظیم برچسب زمانی
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
  }, [currentWindow]);

  // پخش خودکار
  const startAnimation = () => {
    setIsPlaying(true);
    if (animationRef.current) clearInterval(animationRef.current);
    const totalRange = timeRange[1] - timeRange[0];
    const windowSize = currentWindow[1] - currentWindow[0];
    const step = Math.max(3600000, totalRange / 50);
    animationRef.current = setInterval(() => {
      setCurrentWindow(prev => {
        const newStart = prev[0] + step;
        const newEnd = newStart + windowSize;
        if (newEnd >= timeRange[1]) {
          if (loopEnabled) {
            return [timeRange[0], timeRange[0] + windowSize];
          } else {
            clearInterval(animationRef.current);
            setIsPlaying(false);
            return [timeRange[1] - windowSize, timeRange[1]];
          }
        }
        return [newStart, newEnd];
      });
    }, animationSpeed);
  };

  // توقف پخش
  const stopAnimation = () => {
    if (animationRef.current) {
      clearInterval(animationRef.current);
      animationRef.current = null;
    }
    setIsPlaying(false);
  };

  // پاک کردن هنگام unmount
  useEffect(() => {
    return () => {
      stopAnimation();
    };
  }, []);

  // تغییر سرعت
  const changeSpeed = (speed) => {
    setAnimationSpeed(speed);
    if (isPlaying) {
      stopAnimation();
      startAnimation();
    }
  };

  // هماهنگ‌سازی currentWindow با timeRange هنگام تغییر اسلایدر
  useEffect(() => {
    setCurrentWindow(timeRange);
  }, [timeRange]);

  // کیفیت‌ها
  const resolutions = {
    low: { label: "پایین (640×480)", width: 640, height: 480, frameRate: 8 },
    medium: { label: "متوسط (800×600)", width: 800, height: 600, frameRate: 10 },
    high: { label: "بالا (1024×768)", width: 1024, height: 768, frameRate: 12 },
    ultra: { label: "اولترا (1600×1200)", width: 1600, height: 1200, frameRate: 15 }
  };

  // خروجی ویدیو
  const exportAnimationAsVideo = async () => {
    if (!mapRef.current) return;
    const mapContainer = document.getElementById("heatmap-map");
    if (!mapContainer) return;
    const resolution = resolutions[selectedResolution];
    const totalFrames = 30;
    const frameInterval = 1000 / resolution.frameRate;
    const originalHTML = mapContainer.innerHTML;
    mapContainer.innerHTML = `
      <div class="h-full w-full flex flex-col items-center justify-center bg-white">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
        <p class="text-gray-700">در حال تولید ویدیو... (${resolution.label})</p>
        <p class="text-sm text-gray-500 mt-1">${watermarkEnabled ? "با واترمارک" : "بدون واترمارک"}</p>
      </div>
    `;
    try {
      const frames = [];
      const video = new Whammy.Video(resolution.frameRate);
      for (let i = 0; i < totalFrames; i++) {
        // محاسبه پنجره زمانی
        const newStart = timeRange[0] + (i * (timeRange[1] - timeRange[0])) / totalFrames;
        const newEnd = newStart + (currentWindow[1] - currentWindow[0]);
        // فقط مقدار را محاسبه کن، setCurrentWindow نزن
        // نمایش بازه روی نقشه (اختیاری: اگر نیاز به نمایش دارید)
        // گرفتن اسکرین‌شات
        await new Promise(resolve => setTimeout(resolve, frameInterval));
        const canvas = await html2canvas(mapContainer, {
          width: resolution.width,
          height: resolution.height,
          scale: 1,
          useCORS: true,
          logging: false,
          backgroundColor: "#ffffff"
        });
        addWatermarkToCanvas(canvas, newStart);
        video.add(canvas);
        // پیشرفت
        const progress = Math.round(((i + 1) / totalFrames) * 100);
        mapContainer.innerHTML = `
          <div class="h-full w-full flex flex-col items-center justify-center bg-white">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
            <p class="text-gray-700">در حال تولید ویدیو... (${progress}%)</p>
            <p class="text-sm text-gray-500 mt-1">${watermarkEnabled ? "با واترمارک" : "بدون واترمارک"}</p>
          </div>
        `;
      }
      // تولید ویدیو
      const blob = await new Promise(resolve => {
        video.compile(false, resolve);
      });
      // دانلود
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const filename = `گرمایی_${resolution.label.replace(/[()]/g, "")}_${timestamp}.webm`;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
      mapContainer.innerHTML = originalHTML;
      alert(`ویدیو با کیفیت ${resolution.label} تولید و دانلود شد!`);
    } catch (error) {
      console.error("خطا در تولید ویدیو:", error);
      mapContainer.innerHTML = originalHTML;
      let errorMsg = "خطا در تولید ویدیو.";
      if (error.message && error.message.includes("memory")) {
        errorMsg += "\nلطفاً کیفیت پایین‌تری انتخاب کنید.";
      }
      alert(errorMsg);
    } finally {
      mapContainer.innerHTML = originalHTML;
    }
  };

  useEffect(() => {
    const tooltipElems = document.querySelectorAll('.tooltip');
    tooltipElems.forEach(elem => {
      elem.addEventListener('mouseenter', () => {
        elem.querySelector('.tooltip-text').classList.remove('hidden');
      });
      elem.addEventListener('mouseleave', () => {
        elem.querySelector('.tooltip-text').classList.add('hidden');
      });
    });
  }, [dataPoints, currentWindow, selectedResolution]);

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
        <div className="flex items-center space-x-2 space-x-reverse">
          <input
            type="checkbox"
            id="loop-toggle"
            checked={loopEnabled}
            onChange={(e) => setLoopEnabled(e.target.checked)}
            className="w-4 h-4 text-blue-600 form-checkbox"
          />
          <label htmlFor="loop-toggle" className="text-sm">تکرار خودکار</label>
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
          minDistance={60 * 60 * 1000}
          renderThumb={(props) => (
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
      {/* تنظیمات واترمارک */}
      <div className="pt-4 mt-6 border-t">
        <div className="flex items-center space-x-2 space-x-reverse">
          <input
            type="checkbox"
            id="watermark-toggle"
            checked={watermarkEnabled}
            onChange={(e) => setWatermarkEnabled(e.target.checked)}
            className="w-4 h-4 text-blue-600 form-checkbox"
          />
          <label htmlFor="watermark-toggle" className="text-sm font-medium">افزودن واترمارک</label>
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="include-time"
            checked={watermarkIncludeTime}
            onChange={(e) => setWatermarkIncludeTime(e.target.checked)}
            className="w-4 h-4 text-blue-600 form-checkbox"
          />
          <label htmlFor="include-time" className="mr-2 text-sm">افزودن زمان به واترمارک</label>
        </div>
        <div>
          <label className="block mb-1 text-xs text-gray-600">موقعیت واترمارک</label>
          <select
            value={watermarkPosition}
            onChange={(e) => setWatermarkPosition(e.target.value)}
            className="w-full px-3 py-2 text-sm border rounded"
          >
            <option value="bottom-right">گوشه پایین سمت راست</option>
            <option value="bottom-left">گوشه پایین سمت چپ</option>
            <option value="top-right">گوشه بالا سمت راست</option>
            <option value="top-left">گوشه بالا سمت چپ</option>
          </select>
        </div>
        <div>
          <label className="block mb-1 text-xs text-gray-600">
            شفافیت: {Math.round(watermarkOpacity * 100)}%
          </label>
          <input
            type="range"
            min="0.1"
            max="1"
            step="0.1"
            value={watermarkOpacity}
            onChange={(e) => setWatermarkOpacity(parseFloat(e.target.value))}
            className="w-full"
          />
        </div>
        <div className="p-3 mt-4 rounded bg-gray-50">
          <p className="mb-1 text-xs text-gray-600">پیش‌نمایش واترمارک:</p>
          <div
            className="flex items-center justify-center h-12 text-sm font-medium bg-gray-200 rounded"
            style={{
              direction: "ltr",
              color: `rgba(255, 255, 255, ${watermarkOpacity})`,
              backgroundColor: "#6b7280"
            }}
          >
            {watermarkIncludeTime
              ? `${watermarkText} - 1403/05/10 14:30`
              : watermarkText}
          </div>
        </div>
      </div>
      {/* کنترل کیفیت و دکمه خروجی ویدیو */}
      <div className="flex items-center justify-end mt-4 mb-4">
        <span className="mr-2 text-sm">کیفیت ویدیو:</span>
        <select
          value={selectedResolution}
          onChange={(e) => setSelectedResolution(e.target.value)}
          className="px-2 py-1 text-sm border rounded"
        >
          {Object.entries(resolutions).map(([key, res]) => (
            <option key={key} value={key}>
              {res.label}
            </option>
          ))}
        </select>
        <div className="ml-2 tooltip cursor-help">
          <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <span className="absolute z-10 hidden w-64 p-2 text-xs text-white bg-gray-800 rounded tooltip-text">
            کیفیت بالاتر، فایل بزرگ‌تر و زمان پردازش بیشتری دارد
          </span>
        </div>
        <button
          onClick={exportAnimationAsVideo}
          disabled={isPlaying}
          className={`flex items-center px-4 py-2 rounded ml-4 ${
            isPlaying
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-purple-500 hover:bg-purple-600 text-white"
          }`}
        >
          <span className="mr-2">🎥</span>
          خروجی ویدیو
          {isPlaying && (
            <span className="mr-2 text-xs">(غیرفعال در حین پخش)</span>
          )}
        </button>
      </div>
    </div>
  );
  };