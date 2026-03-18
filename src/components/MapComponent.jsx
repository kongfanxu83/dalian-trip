import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { X, MapPin, ChevronDown, ChevronUp, CalendarDays } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BottomNavigation from './BottomNavigation';
import DatePicker from './DatePicker';
import { merchants as allMerchants } from '../data/merchants';

const AMAP_KEY = '7a92ffeb1e82f80519ca060a2b935524';
const AMAP_SECURITY_KEY = '2b38f637e0a3a3ecc672233f52f2dfb6';
const DALIAN_CENTER = [121.618622, 38.91459];

// 大连各区中心坐标
const AREA_COORDS = {
  '中山区':   [121.6447, 38.9183],
  '西岗区':   [121.6120, 38.9220],
  '沙河口区': [121.5940, 38.9050],
  '甘井子区': [121.5250, 38.9530],
  '旅顺口区': [121.2620, 38.8080],
  '金州区':   [121.7830, 39.0500],
  '普兰店区': [121.9640, 39.3930],
  '瓦房店市': [122.0590, 39.6270],
  '庄河市':   [122.9670, 39.6810],
  '长海县':   [122.5890, 39.2720],
};

const CATEGORY_COLORS = {
  '美食': '#FF6B6B',
  '景点': '#4ECDC4',
  '酒店': '#45B7D1',
  '购物': '#FFA07A',
  '娱乐': '#A78BFA',
};

// 每天行程的颜色
const DAY_COLORS = ['#FF6B6B','#4ECDC4','#45B7D1','#FFA07A','#A78BFA','#F59E0B','#10B981'];

// 给商家分配坐标（基于区域 + 确定性偏移，不依赖 API）
function getMerchantCoords(merchant) {
  const base = AREA_COORDS[merchant.area] || DALIAN_CENTER;
  // 用 id 做确定性偏移，同一商家每次坐标相同
  const seed = parseInt(merchant.id) || 0;
  const dx = ((seed * 137 % 200) - 100) * 0.0008;
  const dy = ((seed * 97  % 200) - 100) * 0.0006;
  return [base[0] + dx, base[1] + dy];
}

function createMarkerHTML(merchant, isPlanned, dayIndex) {
  const color = isPlanned ? DAY_COLORS[dayIndex % DAY_COLORS.length] : (CATEGORY_COLORS[merchant.category] || '#999');
  const shortName = merchant.name.length > 7 ? merchant.name.slice(0, 7) + '…' : merchant.name;
  const prefix = isPlanned ? `<span style="margin-right:3px;font-weight:900;">D${dayIndex+1}</span>` : '';
  return `<div style="display:flex;flex-direction:column;align-items:center;">
    <div style="background:${color};color:#fff;font-size:11px;font-weight:700;
      padding:3px 8px;border-radius:12px;white-space:nowrap;
      box-shadow:0 2px 8px rgba(0,0,0,0.3);border:2px solid #fff;line-height:1.5;
      ${isPlanned ? 'outline:2px solid ' + color + ';outline-offset:2px;' : ''}">
      ${prefix}${shortName}
    </div>
    <div style="width:0;height:0;border-left:5px solid transparent;
      border-right:5px solid transparent;border-top:7px solid ${color};"></div>
  </div>`;
}

const MapComponent = () => {
  const navigate = useNavigate();
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const polylinesRef = useRef([]);

  const [activeCategory, setActiveCategory] = useState('全部');
  const [selectedMerchant, setSelectedMerchant] = useState(null);
  const [mapReady, setMapReady] = useState(false);
  const [tripDateItems, setTripDateItems] = useState({});
  const [showDayPicker, setShowDayPicker] = useState(false);
  const [showTripPanel, setShowTripPanel] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [selectedDates, setSelectedDates] = useState({ checkIn: null, checkOut: null });

  // 推荐列表：默认热门，点击商家后换成相关推荐
  const nearbyRecommends = useMemo(() => {
    if (!selectedMerchant) {
      // 默认：按 ranking_score 取前 10
      return [...allMerchants].sort((a, b) => b.ranking_score - a.ranking_score).slice(0, 10);
    }
    // 同区域同类别优先，排除自身
    const sameAreaSameCat = allMerchants.filter(
      m => m.id !== selectedMerchant.id && m.area === selectedMerchant.area && m.category === selectedMerchant.category
    );
    const sameArea = allMerchants.filter(
      m => m.id !== selectedMerchant.id && m.area === selectedMerchant.area && m.category !== selectedMerchant.category
    );
    const sameCat = allMerchants.filter(
      m => m.id !== selectedMerchant.id && m.area !== selectedMerchant.area && m.category === selectedMerchant.category
    );
    return [...sameAreaSameCat, ...sameArea, ...sameCat]
      .sort((a, b) => b.ranking_score - a.ranking_score)
      .slice(0, 8);
  }, [selectedMerchant]);

  // 读取行程规划数据
  const loadTripData = useCallback(() => {
    try {
      const raw = localStorage.getItem('tripDateItems');
      return raw ? JSON.parse(raw) : {};
    } catch { return {}; }
  }, []);

  // 生成日期范围的 key 列表
  const getDateRange = (checkIn, checkOut) => {
    const dates = [];
    const start = new Date(checkIn.year, checkIn.month - 1, checkIn.date);
    const end = new Date(checkOut.year, checkOut.month - 1, checkOut.date);
    const cur = new Date(start);
    while (cur <= end) {
      dates.push(`${cur.getMonth() + 1}-${cur.getDate()}`);
      cur.setDate(cur.getDate() + 1);
    }
    return dates;
  };

  // 选完日期后，确保 tripDateItems 里有对应的 key
  const handleDateSelect = useCallback((checkIn, checkOut) => {
    setSelectedDates({ checkIn, checkOut });
    setIsDatePickerOpen(false);
    if (!checkIn || !checkOut) return;
    const keys = getDateRange(checkIn, checkOut);
    const current = loadTripData();
    let changed = false;
    keys.forEach(k => { if (!current[k]) { current[k] = []; changed = true; } });
    if (changed) {
      localStorage.setItem('tripDateItems', JSON.stringify(current));
      setTripDateItems(current);
      refreshMarkers(current, activeCategory);
    } else {
      setTripDateItems(current);
    }
  }, [loadTripData, activeCategory]);

  // 日期显示文字
  const dateDisplayText = useMemo(() => {
    const { checkIn, checkOut } = selectedDates;
    if (checkIn && checkOut) {
      const start = new Date(checkIn.year, checkIn.month - 1, checkIn.date);
      const end = new Date(checkOut.year, checkOut.month - 1, checkOut.date);
      const days = Math.round((end - start) / 86400000) + 1;
      return `${checkIn.month}月${checkIn.date}日 起 · ${days}天`;
    }
    return '选择天数';
  }, [selectedDates]);

  // 把商家加入某天行程
  const addToDay = useCallback((merchant, dateKey) => {
    const current = loadTripData();
    const dayItems = current[dateKey] || [];
    if (dayItems.find(i => i.id === merchant.id)) return;
    const newItem = { ...merchant, uid: `${merchant.id}-${dateKey}-${dayItems.length}`, peopleCount: 1 };
    const updated = { ...current, [dateKey]: [...dayItems, newItem] };
    localStorage.setItem('tripDateItems', JSON.stringify(updated));
    setTripDateItems(updated);
    setShowDayPicker(false);
    refreshMarkers(updated, activeCategory);
  }, [loadTripData, activeCategory]);

  useEffect(() => {
    const data = loadTripData();
    setTripDateItems(data);
  }, []);

  // 加载地图脚本
  useEffect(() => {
    if (window.AMap) { initMap(); return; }
    window._AMapSecurityConfig = { securityJsCode: AMAP_SECURITY_KEY };
    const script = document.createElement('script');
    script.src = `https://webapi.amap.com/maps?v=1.4.15&key=${AMAP_KEY}`;
    script.async = true;
    script.onload = initMap;
    document.head.appendChild(script);
    return () => {
      if (mapInstanceRef.current) {
        try { mapInstanceRef.current.destroy(); } catch {}
        mapInstanceRef.current = null;
      }
    };
  }, []);

  function initMap() {
    if (!mapRef.current || mapInstanceRef.current) return;
    const map = new window.AMap.Map(mapRef.current, {
      zoom: 12,
      center: DALIAN_CENTER,
      mapStyle: 'amap://styles/normal',
    });
    mapInstanceRef.current = map;
    setMapReady(true);
  }

  useEffect(() => {
    if (!mapReady) return;
    const data = loadTripData();
    setTripDateItems(data);
    refreshMarkers(data, activeCategory);
  }, [mapReady]);

  function clearMap() {
    markersRef.current.forEach(m => { try { m.setMap(null); } catch {} });
    markersRef.current = [];
    polylinesRef.current.forEach(p => { try { p.setMap(null); } catch {} });
    polylinesRef.current = [];
  }

  function refreshMarkers(tripData, category) {
    if (!mapInstanceRef.current) return;
    clearMap();

    // 已规划商家的 id → {dayIndex, order}
    const plannedMap = {};
    const sortedKeys = Object.keys(tripData).sort();
    sortedKeys.forEach((key, dayIdx) => {
      (tripData[key] || []).forEach((item, order) => {
        plannedMap[item.id] = { dayIdx, order };
      });
    });

    // 过滤商家
    const filtered = category === '全部' ? allMerchants : allMerchants.filter(m => m.category === category);

    filtered.forEach(merchant => {
      const coords = getMerchantCoords(merchant);
      const planned = plannedMap[merchant.id];
      const isPlanned = !!planned;
      try {
        const marker = new window.AMap.Marker({
          position: coords,
          content: createMarkerHTML(merchant, isPlanned, planned?.dayIdx ?? 0),
          offset: new window.AMap.Pixel(-45, -36),
          zIndex: isPlanned ? 200 : 100,
        });
        marker.on('click', () => {
          setSelectedMerchant(merchant);
          mapInstanceRef.current.setCenter(coords);
        });
        marker.setMap(mapInstanceRef.current);
        markersRef.current.push(marker);
      } catch {}
    });

    // 画每天的路线连线
    sortedKeys.forEach((key, dayIdx) => {
      const items = tripData[key] || [];
      if (items.length < 2) return;
      const path = items.map(item => {
        const m = allMerchants.find(x => x.id === item.id);
        return m ? getMerchantCoords(m) : null;
      }).filter(Boolean);
      if (path.length < 2) return;
      try {
        const polyline = new window.AMap.Polyline({
          path,
          strokeColor: DAY_COLORS[dayIdx % DAY_COLORS.length],
          strokeWeight: 3,
          strokeOpacity: 0.8,
          strokeStyle: 'dashed',
          lineJoin: 'round',
        });
        polyline.setMap(mapInstanceRef.current);
        polylinesRef.current.push(polyline);
      } catch {}
    });
  }

  function handleCategoryChange(cat) {
    setActiveCategory(cat);
    setSelectedMerchant(null);
    refreshMarkers(tripDateItems, cat);
  }

  const sortedDateKeys = Object.keys(tripDateItems).sort();
  const totalPlanned = Object.values(tripDateItems).reduce((s, arr) => s + arr.length, 0);

  return (
    <div className="min-h-screen bg-[#F4F4F4] pb-16 flex flex-col">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 bg-[#FBE451] z-50 px-4 py-3 flex items-center justify-between">
        <h1 className="text-lg font-bold text-[#333]">地图</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsDatePickerOpen(true)}
            className="flex items-center gap-1.5 text-sm font-semibold text-[#333] bg-white/60 px-3 py-1 rounded-full"
          >
            <CalendarDays className="w-3.5 h-3.5" />
            {dateDisplayText}
          </button>
          {totalPlanned > 0 && (
            <button
              onClick={() => setShowTripPanel(v => !v)}
              className="flex items-center gap-1 text-sm font-semibold text-[#333] bg-white/60 px-3 py-1 rounded-full"
            >
              <MapPin className="w-3.5 h-3.5" />
              {totalPlanned}
              {showTripPanel ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          )}
        </div>
      </div>

      {/* DatePicker */}
      <DatePicker
        isOpen={isDatePickerOpen}
        onClose={() => setIsDatePickerOpen(false)}
        onDateSelect={handleDateSelect}
      />

      {/* 行程概览面板 */}
      {showTripPanel && (
        <div className="fixed top-12 left-0 right-0 bg-white z-40 shadow-lg max-h-48 overflow-y-auto">
          {sortedDateKeys.map((key, dayIdx) => {
            const items = tripDateItems[key] || [];
            if (!items.length) return null;
            const [m, d] = key.split('-');
            return (
              <div key={key} className="px-4 py-2 border-b border-gray-100">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-5 h-5 rounded-full text-white text-xs flex items-center justify-center font-bold"
                    style={{ background: DAY_COLORS[dayIdx % DAY_COLORS.length] }}>
                    {dayIdx + 1}
                  </span>
                  <span className="text-sm font-semibold text-gray-700">{m}月{d}日</span>
                </div>
                <div className="flex gap-2 flex-wrap pl-7">
                  {items.map((item, i) => (
                    <span key={item.uid || i} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                      {item.name.length > 6 ? item.name.slice(0, 6) + '…' : item.name}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
          <div className="px-4 py-2">
            <button onClick={() => navigate('/trip-planner')} className="w-full py-2 bg-[#FBE451] text-[#333] rounded-lg text-sm font-semibold">
              去编辑行程
            </button>
          </div>
        </div>
      )}

      {/* 分类 tabs */}
      <div className="pt-14 px-4 py-2 bg-white shadow-sm">
        <div className="flex space-x-2 overflow-x-auto pb-1">
          {['全部', '美食', '景点', '酒店', '购物', '娱乐'].map(cat => (
            <button key={cat} onClick={() => handleCategoryChange(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                activeCategory === cat ? 'bg-[#FBE451] text-[#333]' : 'bg-gray-100 text-gray-500'
              }`}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 地图 */}
      <div className="px-3 pt-2">
        <div ref={mapRef} style={{ height: '52vh', borderRadius: 12, overflow: 'hidden', border: '1px solid #e5e7eb' }} />
      </div>

      {/* 图例 */}
      {sortedDateKeys.some(k => (tripDateItems[k] || []).length > 0) && (
        <div className="px-4 pt-2 flex gap-3 flex-wrap">
          {sortedDateKeys.map((key, dayIdx) => {
            if (!(tripDateItems[key] || []).length) return null;
            const [m, d] = key.split('-');
            return (
              <div key={key} className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full inline-block" style={{ background: DAY_COLORS[dayIdx % DAY_COLORS.length] }} />
                <span className="text-xs text-gray-500">{m}月{d}日</span>
              </div>
            );
          })}
        </div>
      )}

      {/* 选中商家卡片 */}
      {selectedMerchant && (
        <div className="mx-3 mt-3 bg-white rounded-xl shadow-md p-4 relative">
          <button className="absolute top-3 right-3 text-gray-400" onClick={() => { setSelectedMerchant(null); setShowDayPicker(false); }}>
            <X className="w-4 h-4" />
          </button>
          <div className="flex items-start gap-3">
            <img
              src={selectedMerchant.image_url || `https://nocode.meituan.com/photo/search?keyword=${encodeURIComponent(selectedMerchant.name)}&width=80&height=80`}
              alt={selectedMerchant.name}
              className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
            />
            <div className="flex-1 min-w-0 pr-6">
              <h3 className="font-bold text-[#333] text-base leading-tight">{selectedMerchant.name}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs px-2 py-0.5 rounded-full text-white font-medium"
                  style={{ background: CATEGORY_COLORS[selectedMerchant.category] || '#999' }}>
                  {selectedMerchant.category}
                </span>
                <span className="text-xs text-yellow-500">★ {selectedMerchant.rating}</span>
                {selectedMerchant.price && <span className="text-xs text-green-600">{selectedMerchant.price}</span>}
              </div>
              {selectedMerchant.area && (
                <p className="text-xs text-gray-400 mt-1">{selectedMerchant.area}</p>
              )}
            </div>
          </div>

          {/* 加入行程按钮 */}
          {!showDayPicker ? (
            <button
              onClick={() => setShowDayPicker(true)}
              className="mt-3 w-full py-2 bg-[#FBE451] text-[#333] rounded-lg text-sm font-semibold"
            >
              + 加入行程
            </button>
          ) : (
            <div className="mt-3">
              <p className="text-xs text-gray-500 mb-2">选择加入哪天：</p>
              {sortedDateKeys.length === 0 ? (
                <div className="text-center py-3">
                  <p className="text-xs text-gray-400 mb-2">还没有行程，先去规划日期</p>
                  <button onClick={() => navigate('/trip-planner')} className="text-xs text-blue-500 underline">去行程规划</button>
                </div>
              ) : (
                <div className="flex gap-2 flex-wrap">
                  {sortedDateKeys.map((key, dayIdx) => {
                    const [m, d] = key.split('-');
                    const alreadyIn = (tripDateItems[key] || []).some(i => i.id === selectedMerchant.id);
                    return (
                      <button
                        key={key}
                        disabled={alreadyIn}
                        onClick={() => addToDay(selectedMerchant, key)}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold border-2 transition-all ${
                          alreadyIn
                            ? 'bg-gray-100 text-gray-400 border-gray-200'
                            : 'text-white border-transparent'
                        }`}
                        style={!alreadyIn ? { background: DAY_COLORS[dayIdx % DAY_COLORS.length] } : {}}
                      >
                        {alreadyIn ? '✓ ' : ''}{m}月{d}日
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* 推荐商家 */}
      <div className="px-3 mt-3 pb-20">
        <div className="flex items-center justify-between mb-2 px-1">
          <span className="text-sm font-bold text-[#333]">
            {selectedMerchant ? `${selectedMerchant.area} 附近推荐` : '热门推荐'}
          </span>
          {selectedMerchant && (
            <span className="text-xs text-gray-400">{selectedMerchant.category} · 同区域</span>
          )}
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
          {nearbyRecommends.map(m => {
            const alreadyPlanned = Object.values(tripDateItems).flat().some(i => i.id === m.id);
            return (
              <div
                key={m.id}
                className="flex-shrink-0 w-36 bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 cursor-pointer active:scale-95 transition-transform"
                onClick={() => {
                  setSelectedMerchant(m);
                  setShowDayPicker(false);
                  if (mapInstanceRef.current) {
                    mapInstanceRef.current.setCenter(getMerchantCoords(m));
                    mapInstanceRef.current.setZoom(14);
                  }
                }}
              >
                <img
                  src={m.image_url || `https://nocode.meituan.com/photo/search?keyword=${encodeURIComponent(m.name)}&width=144&height=80`}
                  alt={m.name}
                  className="w-full h-20 object-cover"
                />
                <div className="p-2">
                  <p className="text-xs font-semibold text-[#222] leading-tight line-clamp-2 mb-1">{m.name}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-yellow-500">★ {m.rating}</span>
                    <span
                      className="text-[10px] px-1.5 py-0.5 rounded-full text-white font-medium"
                      style={{ background: CATEGORY_COLORS[m.category] || '#999' }}
                    >
                      {m.category}
                    </span>
                  </div>
                  {m.price && (
                    <p className="text-[10px] text-green-600 mt-0.5">{m.price}</p>
                  )}
                  {alreadyPlanned && (
                    <p className="text-[10px] text-blue-400 mt-0.5">✓ 已加入行程</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default MapComponent;
