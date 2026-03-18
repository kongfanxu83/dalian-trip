import { useNavigate } from 'react-router-dom';
import DatabaseMerchantCard from '../components/DatabaseMerchantCard.jsx';
import travelService from '../services/travelService';
import DatePicker from '../components/DatePicker.jsx';
import { useMerchantData } from '../hooks/useMerchantData';
import { Trash2, Star, Plus, Minus, ChevronLeft, GripVertical, Car, Train, Footprints, Bike, CalendarDays, Wallet } from 'lucide-react';
import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { useCart } from '../hooks/useCart';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const DAY_COLORS = ['#FF6B6B','#4ECDC4','#45B7D1','#FFA07A','#A78BFA','#F59E0B','#10B981'];

// 出行方式图标映射
const TRAVEL_MODE_ICONS = { '驾车': Car, '地铁': Train, '步行': Footprints, '骑行': Bike };

// 商家间出行方式组件
const TravelConnector = ({ fromName, toName, suggestion, loading, onFetch }) => {
  const modes = ['驾车', '地铁', '步行', '骑行'];
  const [selected, setSelected] = useState(null);

  // 从 suggestion 文本里提取推荐方式
  const recommended = suggestion
    ? modes.find(m => suggestion.includes(m)) || null
    : null;

  return (
    <div className="flex items-center gap-2 my-2 px-1">
      {/* 左侧竖线 */}
      <div className="flex flex-col items-center self-stretch ml-3 mr-1">
        <div className="w-px flex-1 bg-gray-200" />
      </div>
      <div className="flex-1 bg-gray-50 border border-gray-100 rounded-2xl px-3 py-2.5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-400 truncate max-w-[60%]">
            {fromName} → {toName}
          </span>
          <button
            onClick={onFetch}
            disabled={loading}
            className="text-xs text-blue-500 font-medium disabled:opacity-50"
          >
            {loading ? '获取中…' : (suggestion ? '重新获取' : '获取建议')}
          </button>
        </div>
        {/* 出行方式选择 */}
        <div className="flex gap-2">
          {modes.map(mode => {
            const Icon = TRAVEL_MODE_ICONS[mode];
            const isRec = mode === recommended;
            const isSel = mode === selected;
            return (
              <button
                key={mode}
                onClick={() => setSelected(mode)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border transition-all ${
                  isSel
                    ? 'bg-[#FBE451] border-[#FBE451] text-[#333]'
                    : isRec
                    ? 'bg-blue-50 border-blue-200 text-blue-600'
                    : 'bg-white border-gray-200 text-gray-500'
                }`}
              >
                {Icon && <Icon className="w-3 h-3" />}
                {mode}
                {isRec && !isSel && <span className="text-blue-400 text-[10px]">推荐</span>}
              </button>
            );
          })}
        </div>
        {suggestion && (
          <p className="text-xs text-gray-400 mt-1.5 leading-relaxed line-clamp-2">{suggestion}</p>
        )}
      </div>
    </div>
  );
};

const TripPlanner = () => {
  const navigate = useNavigate();
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [selectedDates, setSelectedDates] = useState({ checkIn: null, checkOut: null });
  const [dateItems, setDateItems] = useState({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [merchantToDelete, setMerchantToDelete] = useState(null);
  const [favoriteItems, setFavoriteItems] = useState([]);
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingTripId, setEditingTripId] = useState(null);
  const [travelSuggestions, setTravelSuggestions] = useState({});
  const [loadingSuggestions, setLoadingSuggestions] = useState({});
  const [activeId, setActiveId] = useState(null);

  const { cartItems: originalCartItems, addToCart, updatePeopleCount, isInCart, getPeopleCount, clearCart } = useCart();
  const { useFeaturedMerchants } = useMerchantData();
  const { data: recommendations = [], isLoading } = useFeaturedMerchants();

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  const generateDateKey = useCallback((month, date) => {
    const m = typeof month === 'string' ? parseInt(month) : month;
    const d = typeof date === 'string' ? parseInt(date) : date;
    return `${m}-${d}`;
  }, []);

  const getDateRange = useCallback((checkIn, checkOut) => {
    const dates = [];
    const start = new Date(checkIn.year || 2026, checkIn.month - 1, checkIn.date);
    const end = new Date(checkOut.year || 2026, checkOut.month - 1, checkOut.date);
    const current = new Date(start);
    while (current <= end) {
      dates.push({ month: current.getMonth() + 1, date: current.getDate() });
      current.setDate(current.getDate() + 1);
    }
    return dates;
  }, []);

  const allDates = useMemo(() => {
    if (!selectedDates.checkIn || !selectedDates.checkOut) {
      const today = new Date();
      return [{ month: today.getMonth() + 1, date: today.getDate() }];
    }
    return getDateRange(selectedDates.checkIn, selectedDates.checkOut);
  }, [selectedDates, getDateRange]);

  const formatDate = (dateObj) => {
    if (!dateObj) return '';
    const month = dateObj.month.toString().padStart(2, '0');
    const day = dateObj.date.toString().padStart(2, '0');
    return `${month}月${day}日`;
  };

  useEffect(() => {
    const editingTrip = JSON.parse(localStorage.getItem('editingTrip') || 'null');
    if (editingTrip) {
      setIsEditing(true);
      setEditingTripId(editingTrip.id);
      const newDateItems = {};
      editingTrip.dates.forEach(date => {
        const [month, day] = date.date.split('月');
        const dayNumber = parseInt(day.replace('日', ''));
        const dateKey = generateDateKey(month, dayNumber);
        newDateItems[dateKey] = (date.items || []).map((item, i) => ({ ...item, uid: `${item.id}-${dateKey}-${i}` }));
      });
      setDateItems(newDateItems);
      localStorage.removeItem('editingTrip');
    } else {
      const savedCart = JSON.parse(localStorage.getItem('cartItems') || '[]');
      if (savedCart.length > 0) {
        const today = new Date();
        const todayKey = `${today.getMonth() + 1}-${today.getDate()}`;
        setDateItems({ [todayKey]: savedCart.map((item, i) => ({ ...item, uid: `${item.id}-${todayKey}-${i}` })) });
      }
    }
  }, []);

  useEffect(() => {
    setDateItems(prev => {
      const next = { ...prev };
      let changed = false;
      allDates.forEach(d => {
        const key = generateDateKey(d.month, d.date);
        if (!next[key]) { next[key] = []; changed = true; }
      });
      return changed ? next : prev;
    });
  }, [allDates, generateDateKey]);

  useEffect(() => {
    const saved = localStorage.getItem('favoriteItems');
    if (saved) setFavoriteItems(JSON.parse(saved));
  }, []);

  useEffect(() => {
    if (Object.keys(dateItems).length > 0) {
      localStorage.setItem('tripDateItems', JSON.stringify(dateItems));
    }
  }, [dateItems]);

  const handleDateSelect = (checkIn, checkOut) => {
    setSelectedDates({ checkIn, checkOut });
    if (checkIn && checkOut) {
      const dates = getDateRange(checkIn, checkOut);
      const allItems = Object.values(dateItems).flat();
      const newDateItems = {};
      dates.forEach(d => { newDateItems[generateDateKey(d.month, d.date)] = []; });
      allItems.forEach((item, i) => {
        const key = generateDateKey(dates[i % dates.length].month, dates[i % dates.length].date);
        newDateItems[key].push(item);
      });
      setDateItems(newDateItems);
    }
  };

  const getDisplayDateText = () => {
    if (selectedDates.checkIn && selectedDates.checkOut) {
      const days = allDates.length;
      return `${formatDate(selectedDates.checkIn)} 起 · ${days}天`;
    }
    return '点击选择行程天数';
  };

  const handleDragStart = ({ active }) => setActiveId(active.id);

  const handleDragEnd = ({ active, over }) => {
    setActiveId(null);
    if (!over || active.id === over.id) return;
    let srcKey = null, dstKey = null;
    for (const [key, items] of Object.entries(dateItems)) {
      if (items.find(i => i.uid === active.id)) srcKey = key;
      if (items.find(i => i.uid === over.id)) dstKey = key;
    }
    if (!srcKey || !dstKey) return;
    setDateItems(prev => {
      const next = { ...prev };
      if (srcKey === dstKey) {
        const items = [...next[srcKey]];
        const oldIndex = items.findIndex(i => i.uid === active.id);
        const newIndex = items.findIndex(i => i.uid === over.id);
        next[srcKey] = arrayMove(items, oldIndex, newIndex);
      } else {
        const srcItems = [...next[srcKey]];
        const dstItems = [...next[dstKey]];
        const movedIndex = srcItems.findIndex(i => i.uid === active.id);
        const [moved] = srcItems.splice(movedIndex, 1);
        const overIndex = dstItems.findIndex(i => i.uid === over.id);
        dstItems.splice(overIndex >= 0 ? overIndex : dstItems.length, 0, moved);
        next[srcKey] = srcItems;
        next[dstKey] = dstItems;
      }
      return next;
    });
  };

  const activeItem = useMemo(() => {
    if (!activeId) return null;
    for (const items of Object.values(dateItems)) {
      const found = items.find(i => i.uid === activeId);
      if (found) return found;
    }
    return null;
  }, [activeId, dateItems]);

  const handleDeleteClick = (merchant) => { setMerchantToDelete(merchant); setShowDeleteConfirm(true); };

  const confirmDelete = () => {
    if (merchantToDelete) {
      setDateItems(prev => {
        const next = { ...prev };
        Object.keys(next).forEach(key => { next[key] = next[key].filter(i => i.uid !== merchantToDelete.uid); });
        return next;
      });
    }
    setShowDeleteConfirm(false);
    setMerchantToDelete(null);
  };

  const handleFavoriteClick = (merchant) => {
    const isFavorited = favoriteItems.some(item => item.id === merchant.id);
    const updated = isFavorited ? favoriteItems.filter(item => item.id !== merchant.id) : [...favoriteItems, merchant];
    setFavoriteItems(updated);
    localStorage.setItem('favoriteItems', JSON.stringify(updated));
  };

  const calculateDayEstimate = (items) => {
    if (!items || items.length === 0) return 0;
    return items.reduce((total, item) => {
      let p = 0;
      if (typeof item.price === 'string') { const m = item.price.match(/[\d.]+/); if (m) p = parseFloat(m[0]); }
      else if (typeof item.price === 'number') { p = item.price; }
      return total + p * (item.peopleCount || 1);
    }, 0);
  };

  const handleSaveTrip = () => {
    const trip = {
      id: isEditing ? editingTripId : Date.now(),
      name: `行程${new Date().toLocaleDateString()}`,
      dates: allDates.map(date => {
        const dateKey = generateDateKey(date.month, date.date);
        return { date: formatDate(date), items: dateItems[dateKey] || [] };
      }),
      createdAt: new Date().toISOString(),
    };
    // 跳转到路线预览页，把行程数据通过 state 传递
    navigate('/trip-route-preview', { state: { trip, dateItems, allDates } });
  };

  const handleSelectTravelMode = async (dateKey, originIndex) => {
    const items = dateItems[dateKey] || [];
    if (originIndex >= items.length - 1) return;
    const origin = items[originIndex];
    const destination = items[originIndex + 1];
    const [month, day] = dateKey.split('-');
    const date = formatDate({ month: parseInt(month), date: parseInt(day) });
    setLoadingSuggestions(prev => ({ ...prev, [`${dateKey}-${originIndex}`]: true }));
    try {
      const suggestion = await travelService.getTravelSuggestion(origin.name, destination.name, date);
      setTravelSuggestions(prev => ({ ...prev, [`${dateKey}-${originIndex}`]: suggestion }));
    } catch (e) {
      setTravelSuggestions(prev => ({ ...prev, [`${dateKey}-${originIndex}`]: '暂时无法获取建议，请手动选择出行方式' }));
    } finally {
      setLoadingSuggestions(prev => ({ ...prev, [`${dateKey}-${originIndex}`]: false }));
    }
  };

  const allCartItems = Object.values(dateItems).flat();

  return (
    <div className="min-h-screen bg-[#F4F4F4] pb-8">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 bg-[#FBE451] z-50 px-4 py-3">
        <div className="flex items-center justify-between">
          <button onClick={() => navigate('/')} className="flex items-center text-[#333] font-bold">
            <ChevronLeft className="w-5 h-5" />
            <span className="ml-1 text-sm">返回</span>
          </button>
          <h1 className="text-base font-bold text-[#333]">{isEditing ? '修改行程' : '行程规划'}</h1>
          <div className="w-14" />
        </div>
      </div>

      <div className="pt-14 px-4">
        {/* 日期选择条 */}
        <button
          onClick={() => setIsDatePickerOpen(true)}
          className="w-full mt-3 mb-4 flex items-center justify-between bg-white rounded-2xl px-4 py-3 shadow-sm border border-gray-100"
        >
          <div className="flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-[#e6c800]" />
            <span className="text-sm font-semibold text-[#333]">{getDisplayDateText()}</span>
          </div>
          <span className="text-xs text-blue-500 font-medium">修改日期</span>
        </button>

        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          {allDates.map((date, dayIdx) => {
            const dateKey = generateDateKey(date.month, date.date);
            const itemsForDate = dateItems[dateKey] || [];
            const uids = itemsForDate.map(i => i.uid);
            const dayColor = DAY_COLORS[dayIdx % DAY_COLORS.length];
            const estimate = calculateDayEstimate(itemsForDate);

            return (
              <div key={dateKey} className="mb-5">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full text-white text-xs font-bold flex items-center justify-center flex-shrink-0" style={{ background: dayColor }}>
                      {dayIdx + 1}
                    </span>
                    <span className="text-sm font-bold text-[#333]">{formatDate(date)}</span>
                  </div>
                  {estimate > 0 && (
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <Wallet className="w-3.5 h-3.5" />
                      <span>预估 ¥{estimate}</span>
                    </div>
                  )}
                </div>

                <SortableContext items={uids} strategy={verticalListSortingStrategy}>
                  <div className="min-h-[60px]">
                    {itemsForDate.length > 0 ? (
                      itemsForDate.map((item, index) => (
                        <React.Fragment key={item.uid}>
                          <SortableItem item={item} onDelete={handleDeleteClick} onPeopleChange={updatePeopleCount} />
                          {index < itemsForDate.length - 1 && (
                            <TravelConnector
                              fromName={item.name}
                              toName={itemsForDate[index + 1].name}
                              suggestion={travelSuggestions[`${dateKey}-${index}`]}
                              loading={!!loadingSuggestions[`${dateKey}-${index}`]}
                              onFetch={() => handleSelectTravelMode(dateKey, index)}
                            />
                          )}
                        </React.Fragment>
                      ))
                    ) : (
                      <div className="h-16 border-2 border-dashed border-gray-200 rounded-2xl flex items-center justify-center bg-white/50">
                        <span className="text-gray-300 text-sm">从下方推荐中添加地点</span>
                      </div>
                    )}
                  </div>
                </SortableContext>
              </div>
            );
          })}

          <DragOverlay>
            {activeItem ? (
              <div className="bg-white rounded-2xl shadow-2xl border border-blue-200 px-4 py-3 opacity-95">
                <div className="font-semibold text-[#333] text-sm">{activeItem.name}</div>
                <div className="text-xs text-gray-400 mt-0.5">{activeItem.area}</div>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>

        {/* 操作按钮 */}
        <div className="mb-6 mt-2">
          <button
            className={`w-full py-3 rounded-2xl font-semibold text-sm ${allCartItems.length > 0 ? 'bg-[#FBE451] text-[#333]' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
            onClick={handleSaveTrip}
            disabled={allCartItems.length === 0}
          >
            {isEditing ? '保存修改' : '生成行程'}
          </button>
        </div>

        {/* 推荐 */}
        <div>
          <h2 className="text-base font-bold text-[#333] mb-3">推荐地点</h2>
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#FBE451] mx-auto" />
            </div>
          ) : recommendations.length > 0 ? (
            recommendations.map((item) => (
              <DatabaseMerchantCard
                key={item.id}
                merchant={item}
                onAddClick={(merchant, count) => {
                  addToCart(merchant, count);
                  const firstKey = generateDateKey(allDates[0].month, allDates[0].date);
                  const uid = `${merchant.id}-${firstKey}-${Date.now()}`;
                  setDateItems(prev => ({
                    ...prev,
                    [firstKey]: [...(prev[firstKey] || []), { ...merchant, peopleCount: count || 1, uid }],
                  }));
                }}
                onPeopleCountChange={updatePeopleCount}
                isInCart={isInCart(item.id)}
                cartPeopleCount={getPeopleCount(item.id)}
                onFavoriteClick={handleFavoriteClick}
                isFavorited={favoriteItems.some(f => f.id === item.id)}
              />
            ))
          ) : (
            <div className="text-center py-8 text-gray-400 text-sm">暂无推荐商家</div>
          )}
        </div>
      </div>

      <DatePicker isOpen={isDatePickerOpen} onClose={() => setIsDatePickerOpen(false)} onDateSelect={handleDateSelect} />

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-xl max-w-xs w-full mx-4">
            <h3 className="text-base font-bold text-[#333] mb-4 text-center">确认删除该地点？</h3>
            <div className="flex gap-3">
              <button onClick={() => { setShowDeleteConfirm(false); setMerchantToDelete(null); }} className="flex-1 py-2.5 text-gray-500 border border-gray-200 rounded-xl text-sm">取消</button>
              <button onClick={confirmDelete} className="flex-1 py-2.5 bg-red-500 text-white rounded-xl text-sm font-semibold">删除</button>
            </div>
          </div>
        </div>
      )}

      {showSaveConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setShowSaveConfirm(false)}>
          <div className="bg-white p-6 rounded-2xl shadow-xl max-w-xs w-full mx-4 text-center" onClick={e => e.stopPropagation()}>
            <div className="text-3xl mb-3">🎉</div>
            <h3 className="text-base font-bold text-[#333] mb-4">{isEditing ? '修改成功' : '已保存至我的行程'}</h3>
            <button onClick={() => setShowSaveConfirm(false)} className="px-8 py-2.5 bg-[#FBE451] text-[#333] rounded-xl font-semibold text-sm">好的</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TripPlanner;
