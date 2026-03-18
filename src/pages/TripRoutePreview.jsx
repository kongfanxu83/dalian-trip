import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, CheckCircle, Car, Train, Footprints, Bike, Loader2, Sparkles, ChevronDown } from 'lucide-react';
import { merchants as allMerchants } from '../data/merchants';
import travelService from '../services/travelService';

const AMAP_KEY = '7a92ffeb1e82f80519ca060a2b935524';
const AMAP_SECURITY_KEY = '2b38f637e0a3a3ecc672233f52f2dfb6';
const DALIAN_CENTER = [121.618622, 38.91459];
const DAY_COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#A78BFA', '#F59E0B', '#10B981'];
const AREA_COORDS = {
  '中山区':   [121.6447, 38.9183],
  '西岗区':   [121.6120, 38.9220],
  '沙河口区': [121.5940, 38.9050],
  '甘井子区': [121.5250, 38.9530],
  '旅顺口区': [121.2620, 38.8080],
  '金州区':   [121.7830, 39.0500],
};

const MODE_CONFIG = {
  walking: { label: '步行', Icon: Footprints, color: '#10B981' },
  transit: { label: '公交', Icon: Train,     color: '#45B7D1' },
  driving: { label: '打车', Icon: Car,       color: '#FFA07A' },
};

function getMerchantCoords(merchant) {
  const base = AREA_COORDS[merchant.area] || DALIAN_CENTER;
  const seed = parseInt(merchant.id) || 0;
  return [base[0] + ((seed * 137 % 200) - 100) * 0.0008, base[1] + ((seed * 97 % 200) - 100) * 0.0006];
}

async function fetchRoute(origin, destination, mode) {
  const endpoints = {
    walking: 'https://restapi.amap.com/v3/direction/walking',
    transit:  'https://restapi.amap.com/v3/direction/transit/integrated',
    driving:  'https://restapi.amap.com/v3/direction/driving',
  };
  const params = new URLSearchParams({
    key: AMAP_KEY,
    origin: `${origin[0]},${origin[1]}`,
    destination: `${destination[0]},${destination[1]}`,
    city: '0411', output: 'json',
  });
  try {
    const data = await fetch(`${endpoints[mode]}?${params}`).then(r => r.json());
    if (mode === 'walking' && data.route?.paths?.[0]) {
      const p = data.route.paths[0];
      return { duration: Math.ceil(p.duration / 60), distance: (p.distance / 1000).toFixed(1) };
    }
    if (mode === 'driving' && data.route?.paths?.[0]) {
      const p = data.route.paths[0];
      return { duration: Math.ceil(p.duration / 60), distance: (p.distance / 1000).toFixed(1) };
    }
    if (mode === 'transit' && data.route?.transits?.[0]) {
      const t = data.route.transits[0];
      return { duration: Math.ceil(t.duration / 60), distance: (data.route.distance / 1000).toFixed(1) };
    }
    return null;
  } catch { return null; }
}

// ─── 两点之间的连接器组件 ───────────────────────────────────────────
const RouteConnector = ({ routeKey, from, to, dateLabel, color, routeInfo, loadingRoute, selectedMode, onSelectMode }) => {
  const [aiText, setAiText] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiDone, setAiDone] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const fetchAI = async () => {
    if (aiLoading || aiDone) return;
    setAiLoading(true);
    setExpanded(true);
    try {
      const result = await travelService.getTravelSuggestion(from, to, dateLabel);
      setAiText(result);
      setAiDone(true);
    } catch {
      setAiText('暂时无法获取建议，请手动选择出行方式。');
      setAiDone(true);
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="flex gap-2 my-1">
      {/* 左侧彩色竖线 */}
      <div className="flex flex-col items-center pl-5 pr-2 flex-shrink-0">
        <div className="w-0.5 flex-1 mt-1" style={{ background: color, minHeight: 32 }} />
      </div>

      <div className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm px-3 py-3 mb-1">
        {/* 三种交通方式 */}
        {loadingRoute ? (
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
            <Loader2 className="w-3 h-3 animate-spin" /> 查询出行时间…
          </div>
        ) : (
          <div className="flex gap-2 mb-2 flex-wrap">
            {Object.entries(MODE_CONFIG).map(([key, { label, Icon, color: mColor }]) => {
              const info = routeInfo?.[key];
              const isSel = selectedMode === key;
              return (
                <button
                  key={key}
                  onClick={() => onSelectMode(routeKey, key)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border-2 transition-all ${
                    isSel ? 'text-white border-transparent' : 'bg-gray-50 border-gray-100 text-gray-500'
                  }`}
                  style={isSel ? { background: mColor, borderColor: mColor } : {}}
                >
                  <Icon className="w-3.5 h-3.5" style={{ color: isSel ? '#fff' : mColor }} />
                  <span>{label}</span>
                  {info ? (
                    <span className={isSel ? 'text-white/80' : 'text-gray-400'}>{info.duration}分钟</span>
                  ) : (
                    <span className="text-gray-300">—</span>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* AI 建议区 */}
        <div>
          <button
            onClick={fetchAI}
            disabled={aiLoading}
            className="flex items-center gap-1.5 text-xs text-blue-500 font-medium"
          >
            <Sparkles className="w-3.5 h-3.5" />
            {aiLoading ? '获取 AI 建议中…' : aiDone ? '已获取 AI 建议' : '获取 AI 出行建议'}
            {aiDone && (
              <ChevronDown
                className={`w-3 h-3 transition-transform ${expanded ? 'rotate-180' : ''}`}
                onClick={(e) => { e.stopPropagation(); setExpanded(v => !v); }}
              />
            )}
          </button>
          {expanded && aiText && (
            <p className="mt-2 text-xs text-gray-500 leading-relaxed bg-blue-50 rounded-xl px-3 py-2">
              {aiText}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── 主页面 ────────────────────────────────────────────────────────
const TripRoutePreview = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { trip, dateItems, allDates } = location.state || {};

  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  const [mapReady, setMapReady] = useState(false);
  const [routeData, setRouteData] = useState({});
  const [loadingRoutes, setLoadingRoutes] = useState(true);
  const [activeDay, setActiveDay] = useState(null);
  const [saving, setSaving] = useState(false);
  const [showSharePrompt, setShowSharePrompt] = useState(false);
  // 用户选择的出行方式：{ "dayKey-idx": "walking"|"transit"|"driving" }
  const [selectedModes, setSelectedModes] = useState({});

  const sortedDateKeys = allDates ? allDates.map(d => `${d.month}-${d.date}`) : [];

  const getMerchant = useCallback((item) => allMerchants.find(m => m.id === item.id) || item, []);

  // 加载地图
  useEffect(() => {
    if (window.AMap) { initMap(); return; }
    window._AMapSecurityConfig = { securityJsCode: AMAP_SECURITY_KEY };
    const script = document.createElement('script');
    script.src = `https://webapi.amap.com/maps?v=1.4.15&key=${AMAP_KEY}`;
    script.async = true;
    script.onload = initMap;
    document.head.appendChild(script);
    return () => {
      if (mapInstanceRef.current) { try { mapInstanceRef.current.destroy(); } catch {} mapInstanceRef.current = null; }
    };
  }, []);

  function initMap() {
    if (!mapRef.current || mapInstanceRef.current) return;
    const map = new window.AMap.Map(mapRef.current, { zoom: 12, center: DALIAN_CENTER, mapStyle: 'amap://styles/normal' });
    mapInstanceRef.current = map;
    setMapReady(true);
  }

  useEffect(() => { if (mapReady && dateItems) drawAllRoutes(); }, [mapReady]);

  function drawAllRoutes() {
    if (!mapInstanceRef.current || !dateItems) return;
    const map = mapInstanceRef.current;
    sortedDateKeys.forEach((key, dayIdx) => {
      const items = dateItems[key] || [];
      if (!items.length) return;
      const color = DAY_COLORS[dayIdx % DAY_COLORS.length];
      const path = items.map(item => getMerchantCoords(getMerchant(item)));
      if (path.length >= 2) {
        try { new window.AMap.Polyline({ map, path, strokeColor: color, strokeWeight: 4, strokeOpacity: 0.85, strokeStyle: 'solid', lineJoin: 'round' }); } catch {}
      }
      items.forEach((item, idx) => {
        const merchant = getMerchant(item);
        const coords = getMerchantCoords(merchant);
        const shortName = merchant.name.length > 6 ? merchant.name.slice(0, 6) + '…' : merchant.name;
        const content = `<div style="display:flex;flex-direction:column;align-items:center;"><div style="background:${color};color:#fff;font-size:11px;font-weight:700;padding:3px 8px;border-radius:12px;white-space:nowrap;box-shadow:0 2px 8px rgba(0,0,0,0.25);border:2px solid #fff;line-height:1.5;">${idx + 1}. ${shortName}</div><div style="width:0;height:0;border-left:5px solid transparent;border-right:5px solid transparent;border-top:7px solid ${color};"></div></div>`;
        try { new window.AMap.Marker({ map, position: coords, content, offset: new window.AMap.Pixel(-45, -36), zIndex: 150 }); } catch {}
      });
    });
    try { map.setFitView(); } catch {}
  }

  // 查询高德出行时间
  useEffect(() => { if (dateItems) fetchAllRoutes(); }, [dateItems]);

  async function fetchAllRoutes() {
    setLoadingRoutes(true);
    const results = {};
    for (const key of sortedDateKeys) {
      const items = dateItems[key] || [];
      for (let i = 0; i < items.length - 1; i++) {
        const origin = getMerchantCoords(getMerchant(items[i]));
        const dest   = getMerchantCoords(getMerchant(items[i + 1]));
        const [walking, transit, driving] = await Promise.all([
          fetchRoute(origin, dest, 'walking'),
          fetchRoute(origin, dest, 'transit'),
          fetchRoute(origin, dest, 'driving'),
        ]);
        results[`${key}-${i}`] = { walking, transit, driving };
      }
    }
    setRouteData(results);
    setLoadingRoutes(false);
  }

  const handleSelectMode = useCallback((routeKey, mode) => {
    setSelectedModes(prev => ({ ...prev, [routeKey]: mode }));
  }, []);

  // 确认保存 —— 把选择的出行方式写入行程
  function handleConfirm() {
    if (!trip) return;
    setSaving(true);

    // 把 selectedModes 注入 trip.dates 里
    const enrichedTrip = {
      ...trip,
      dates: trip.dates.map(dateObj => {
        const [mon, dayStr] = dateObj.date.split('月');
        const day = dayStr.replace('日', '');
        const key = `${parseInt(mon)}-${parseInt(day)}`;
        const itemsWithMode = (dateObj.items || []).map((item, idx) => ({
          ...item,
          travelModeToNext: selectedModes[`${key}-${idx}`] || null,
          travelTimeToNext: routeData[`${key}-${idx}`]?.[selectedModes[`${key}-${idx}`]] || null,
        }));
        return { ...dateObj, items: itemsWithMode };
      }),
      selectedModes,
    };

    const savedTrips = JSON.parse(localStorage.getItem('myTrips') || '[]');
    const exists = savedTrips.find(t => t.id === enrichedTrip.id);
    const updatedTrips = exists
      ? savedTrips.map(t => t.id === enrichedTrip.id ? enrichedTrip : t)
      : [...savedTrips, enrichedTrip];
    localStorage.setItem('myTrips', JSON.stringify(updatedTrips));
    localStorage.removeItem('cartItems');
    localStorage.removeItem('tripDateItems');
    setSaving(false);
    setShowSharePrompt(true);
  }

  if (!trip || !dateItems) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-400 mb-4">没有行程数据</p>
          <button onClick={() => navigate('/trip-planner')} className="px-4 py-2 bg-[#FBE451] rounded-xl text-sm font-semibold">返回规划</button>
        </div>
      </div>
    );
  }

  // 统计已选出行方式的段数
  const totalSegments = sortedDateKeys.reduce((s, key) => s + Math.max(0, (dateItems[key] || []).length - 1), 0);
  const selectedCount = Object.keys(selectedModes).length;

  return (
    <div className="min-h-screen bg-[#F4F4F4]">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 bg-[#FBE451] z-50 px-4 py-3 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="flex items-center text-[#333] font-bold">
          <ChevronLeft className="w-5 h-5" /><span className="text-sm ml-1">返回</span>
        </button>
        <h1 className="text-base font-bold text-[#333]">路线预览</h1>
        <span className="text-xs text-gray-500">{selectedCount}/{totalSegments} 已选</span>
      </div>

      <div className="pt-14">
        {/* 地图 */}
        <div ref={mapRef} style={{ height: '40vh', width: '100%' }} />

        {/* 天数筛选 */}
        <div className="px-4 py-2 bg-white flex gap-2 flex-wrap border-b border-gray-100">
          {sortedDateKeys.map((key, dayIdx) => {
            const items = dateItems[key] || [];
            if (!items.length) return null;
            const [m, d] = key.split('-');
            const active = activeDay === key;
            return (
              <button
                key={key}
                onClick={() => setActiveDay(active ? null : key)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all border-2 ${active ? 'border-transparent text-white' : 'bg-white text-gray-600 border-gray-200'}`}
                style={active ? { background: DAY_COLORS[dayIdx % DAY_COLORS.length] } : {}}
              >
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: DAY_COLORS[dayIdx % DAY_COLORS.length] }} />
                {m}月{d}日 · {items.length}个
              </button>
            );
          })}
        </div>

        {/* 路线详情 */}
        <div className="px-4 py-3 pb-36">
          {sortedDateKeys.map((key, dayIdx) => {
            const items = dateItems[key] || [];
            if (!items.length || (activeDay && activeDay !== key)) return null;
            const [m, d] = key.split('-');
            const color = DAY_COLORS[dayIdx % DAY_COLORS.length];

            return (
              <div key={key} className="mb-6">
                {/* 天标题 */}
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-6 h-6 rounded-full text-white text-xs font-bold flex items-center justify-center flex-shrink-0" style={{ background: color }}>
                    {dayIdx + 1}
                  </span>
                  <span className="text-sm font-bold text-[#333]">{m}月{d}日</span>
                </div>

                {items.map((item, idx) => {
                  const merchant = getMerchant(item);
                  const routeKey = `${key}-${idx}`;
                  const isLast = idx === items.length - 1;

                  return (
                    <React.Fragment key={item.uid || idx}>
                      {/* 地点卡片 */}
                      <div className="flex items-center gap-3 bg-white rounded-2xl px-4 py-3 shadow-sm border border-gray-100">
                        <span className="w-7 h-7 rounded-full text-white text-xs font-bold flex items-center justify-center flex-shrink-0" style={{ background: color }}>
                          {idx + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-[#222] truncate">{merchant.name}</p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {merchant.area}{merchant.address ? ` · ${merchant.address}` : ''}
                          </p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          {merchant.price && <p className="text-xs text-green-600">{merchant.price}</p>}
                          <p className="text-xs text-yellow-500">★ {merchant.rating}</p>
                        </div>
                      </div>

                      {/* 两点之间连接器 */}
                      {!isLast && (
                        <RouteConnector
                          routeKey={routeKey}
                          from={merchant.name}
                          to={getMerchant(items[idx + 1]).name}
                          dateLabel={`${m}月${d}日`}
                          color={color}
                          routeInfo={routeData[routeKey]}
                          loadingRoute={loadingRoutes && !routeData[routeKey]}
                          selectedMode={selectedModes[routeKey] || null}
                          onSelectMode={handleSelectMode}
                        />
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      {/* 分享确认弹窗 */}
      {showSharePrompt && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl mx-5 p-6 w-full max-w-xs text-center shadow-2xl">
            <div className="text-4xl mb-3">🎉</div>
            <h3 className="text-base font-bold text-[#333] mb-1">行程已保存！</h3>
            <p className="text-sm text-gray-400 mb-5">是否将此行程分享至发现大厅，让更多人看到你的旅行计划？</p>
            <div className="flex gap-3">
              <button
                onClick={() => navigate('/my-trips')}
                className="flex-1 py-2.5 rounded-2xl border border-gray-200 text-sm text-gray-500 font-semibold"
              >
                不了
              </button>
              <button
                onClick={() => {
                  const existing = JSON.parse(localStorage.getItem('sharedTrips') || '[]');
                  const shared = { ...trip, sharedAt: new Date().toISOString() };
                  localStorage.setItem('sharedTrips', JSON.stringify([...existing, shared]));
                  navigate('/my-trips');
                }}
                className="flex-1 py-2.5 rounded-2xl bg-[#FBE451] text-[#333] text-sm font-bold"
              >
                分享 ✈️
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 底部确认 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-4 pb-6">
        {totalSegments > 0 && selectedCount < totalSegments && (
          <p className="text-xs text-gray-400 text-center mb-2">
            还有 {totalSegments - selectedCount} 段未选择出行方式，可跳过直接保存
          </p>
        )}
        <button
          onClick={handleConfirm}
          disabled={saving}
          className="w-full py-3.5 bg-[#FBE451] text-[#333] rounded-2xl font-bold text-base flex items-center justify-center gap-2 active:scale-95 transition-transform disabled:opacity-60"
        >
          {saving
            ? <><Loader2 className="w-4 h-4 animate-spin" /> 保存中…</>
            : <><CheckCircle className="w-5 h-5" /> 确认行程并保存</>}
        </button>
      </div>
    </div>
  );
};

export default TripRoutePreview;
