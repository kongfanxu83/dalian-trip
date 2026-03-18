import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  ChevronLeft, Heart, Star, MapPin, Clock, Phone,
  Plus, Minus, CheckCircle, Share2, Sparkles
} from 'lucide-react';
import { merchants as allMerchants } from '../data/merchants';
import { useCart } from '../hooks/useCart';

const CATEGORY_COLORS = {
  '美食': '#FF6B6B',
  '景点': '#4ECDC4',
  '酒店': '#45B7D1',
  '购物': '#FFA07A',
  '娱乐': '#A78BFA',
};

// 根据商家信息自动生成推荐理由
function genRecommendReason(merchant) {
  const reasons = [];
  if (merchant.rating >= 4.8) reasons.push('评分极高，口碑极佳');
  else if (merchant.rating >= 4.5) reasons.push('评分优秀，广受好评');
  if (merchant.favorite_count >= 1500) reasons.push(`超过 ${(merchant.favorite_count / 1000).toFixed(1)}k 人收藏`);
  if (merchant.is_featured) reasons.push('编辑精选推荐');
  if (merchant.tag) {
    const tags = merchant.tag.split(',').slice(0, 2);
    reasons.push(`特色：${tags.join('、')}`);
  }
  if (merchant.description) reasons.push(merchant.description);
  return reasons;
}

// 同类推荐（同区域或同类别）
function getRelated(merchant) {
  return allMerchants
    .filter(m => m.id !== merchant.id && (m.area === merchant.area || m.category === merchant.category))
    .sort((a, b) => b.ranking_score - a.ranking_score)
    .slice(0, 6);
}

const MerchantDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const merchant = allMerchants.find(m => m.id === id);

  const [favorited, setFavorited] = useState(false);
  const [peopleCount, setPeopleCount] = useState(1);
  const [addedToDay, setAddedToDay] = useState(null);
  const [showDayPicker, setShowDayPicker] = useState(false);
  const [tripDateItems, setTripDateItems] = useState({});

  const { addToCart, isInCart } = useCart();
  const alreadyInCart = merchant ? isInCart(merchant.id) : false;

  useEffect(() => {
    if (!merchant) return;
    // 读取收藏状态
    const favs = JSON.parse(localStorage.getItem('favoriteItems') || '[]');
    setFavorited(favs.some(f => f.id === merchant.id));
    // 读取行程
    const trip = JSON.parse(localStorage.getItem('tripDateItems') || '{}');
    setTripDateItems(trip);
  }, [merchant]);

  if (!merchant) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-400 mb-4">找不到该商家</p>
          <button onClick={() => navigate(-1)} className="px-4 py-2 bg-[#FBE451] rounded-xl text-sm font-semibold">返回</button>
        </div>
      </div>
    );
  }

  const color = CATEGORY_COLORS[merchant.category] || '#FBE451';
  const reasons = genRecommendReason(merchant);
  const related = getRelated(merchant);
  const sortedDateKeys = Object.keys(tripDateItems).sort();

  const handleFavorite = () => {
    const favs = JSON.parse(localStorage.getItem('favoriteItems') || '[]');
    let updated;
    if (favorited) {
      updated = favs.filter(f => f.id !== merchant.id);
    } else {
      updated = [...favs, merchant];
    }
    localStorage.setItem('favoriteItems', JSON.stringify(updated));
    setFavorited(!favorited);
  };

  const handleAddToCart = () => {
    addToCart(merchant, peopleCount);
    setShowDayPicker(true);
  };

  const handleAddToDay = (dateKey) => {
    const current = JSON.parse(localStorage.getItem('tripDateItems') || '{}');
    const dayItems = current[dateKey] || [];
    if (dayItems.find(i => i.id === merchant.id)) {
      setAddedToDay(dateKey);
      setShowDayPicker(false);
      return;
    }
    const uid = `${merchant.id}-${dateKey}-${dayItems.length}`;
    const updated = {
      ...current,
      [dateKey]: [...dayItems, { ...merchant, uid, peopleCount }],
    };
    localStorage.setItem('tripDateItems', JSON.stringify(updated));
    setTripDateItems(updated);
    setAddedToDay(dateKey);
    setShowDayPicker(false);
  };

  return (
    <div className="min-h-screen bg-[#F4F4F4] pb-32">
      {/* 顶部图片区 */}
      <div className="relative">
        <img
          src={merchant.image_url || `https://nocode.meituan.com/photo/search?keyword=${encodeURIComponent(merchant.name)}&width=800&height=400`}
          alt={merchant.name}
          className="w-full object-cover"
          style={{ height: '56vw', maxHeight: 260 }}
        />
        {/* 渐变遮罩 */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* 返回 */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 w-9 h-9 bg-black/30 backdrop-blur-sm rounded-full flex items-center justify-center"
        >
          <ChevronLeft className="w-5 h-5 text-white" />
        </button>

        {/* 收藏 */}
        <button
          onClick={handleFavorite}
          className="absolute top-4 right-4 w-9 h-9 bg-black/30 backdrop-blur-sm rounded-full flex items-center justify-center"
        >
          <Heart className={`w-5 h-5 ${favorited ? 'text-red-400 fill-current' : 'text-white'}`} />
        </button>

        {/* 底部名称 */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs px-2 py-0.5 rounded-full text-white font-semibold" style={{ background: color }}>
              {merchant.category}
            </span>
            {merchant.is_featured && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-400 text-[#333] font-semibold">精选</span>
            )}
          </div>
          <h1 className="text-xl font-bold text-white leading-tight">{merchant.name}</h1>
        </div>
      </div>

      <div className="px-4 pt-4 space-y-3">
        {/* 评分 & 价格 */}
        <div className="bg-white rounded-2xl px-4 py-4 flex items-center justify-around shadow-sm">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1">
              <Star className="w-5 h-5 text-yellow-400 fill-current" />
              <span className="text-2xl font-bold text-[#333]">{merchant.rating}</span>
            </div>
            <p className="text-xs text-gray-400 mt-0.5">综合评分</p>
          </div>
          <div className="w-px h-10 bg-gray-100" />
          <div className="text-center">
            <p className="text-lg font-bold text-green-600">{merchant.price || '免费'}</p>
            <p className="text-xs text-gray-400 mt-0.5">人均消费</p>
          </div>
          <div className="w-px h-10 bg-gray-100" />
          <div className="text-center">
            <p className="text-lg font-bold text-[#333]">{merchant.favorite_count >= 1000 ? `${(merchant.favorite_count / 1000).toFixed(1)}k` : merchant.favorite_count}</p>
            <p className="text-xs text-gray-400 mt-0.5">收藏人数</p>
          </div>
        </div>

        {/* 基本信息 */}
        <div className="bg-white rounded-2xl px-4 py-4 shadow-sm space-y-3">
          <h2 className="text-sm font-bold text-[#333]">基本信息</h2>
          {merchant.area && (
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-gray-700">{merchant.area}</p>
                {merchant.address && <p className="text-xs text-gray-400 mt-0.5">{merchant.address}</p>}
              </div>
            </div>
          )}
          {merchant.business_hours && (
            <div className="flex items-center gap-3">
              <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <p className="text-sm text-gray-700">{merchant.business_hours}</p>
            </div>
          )}
          {merchant.phone && (
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <p className="text-sm text-gray-700">{merchant.phone}</p>
            </div>
          )}
          {merchant.tag && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {merchant.tag.split(',').map(t => (
                <span key={t} className="text-xs px-2.5 py-1 rounded-full bg-gray-100 text-gray-600">{t.trim()}</span>
              ))}
            </div>
          )}
        </div>

        {/* 推荐理由 */}
        {reasons.length > 0 && (
          <div className="bg-white rounded-2xl px-4 py-4 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              <h2 className="text-sm font-bold text-[#333]">推荐理由</h2>
            </div>
            <ul className="space-y-2">
              {reasons.map((r, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 flex-shrink-0 mt-1.5" />
                  <p className="text-sm text-gray-600 leading-relaxed">{r}</p>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 相关推荐 */}
        {related.length > 0 && (
          <div>
            <h2 className="text-sm font-bold text-[#333] mb-2 px-1">附近还有</h2>
            <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
              {related.map(m => (
                <div
                  key={m.id}
                  onClick={() => navigate(`/merchant/${m.id}`)}
                  className="flex-shrink-0 w-32 bg-white rounded-2xl overflow-hidden shadow-sm cursor-pointer active:scale-95 transition-transform"
                >
                  <img
                    src={m.image_url || `https://nocode.meituan.com/photo/search?keyword=${encodeURIComponent(m.name)}&width=128&height=80`}
                    alt={m.name}
                    className="w-full h-20 object-cover"
                  />
                  <div className="p-2">
                    <p className="text-xs font-semibold text-[#222] line-clamp-2 leading-tight mb-1">{m.name}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-yellow-500">★ {m.rating}</span>
                      <span className="text-[10px] text-green-600">{m.price || '免费'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 底部操作栏 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 pt-3 pb-6 space-y-2">
        {/* 加入行程按钮 */}
        {!showDayPicker && !addedToDay ? (
          <div className="flex items-center gap-3">
            {/* 人数调节 */}
            <div className="flex items-center bg-gray-100 rounded-full px-3 py-1.5 gap-3">
              <button onClick={() => setPeopleCount(c => Math.max(1, c - 1))} className="text-gray-500">
                <Minus className="w-4 h-4" />
              </button>
              <span className="text-sm font-semibold text-[#333] w-4 text-center">{peopleCount}</span>
              <button onClick={() => setPeopleCount(c => c + 1)} className="text-gray-500">
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <button
              onClick={alreadyInCart ? () => setShowDayPicker(true) : handleAddToCart}
              className="flex-1 py-3 rounded-2xl bg-[#FBE451] text-[#333] font-bold text-sm flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              {alreadyInCart ? '选择加入哪天' : '加入行程'}
            </button>
          </div>
        ) : addedToDay ? (
          <div className="flex items-center justify-center gap-2 py-3 bg-green-50 rounded-2xl">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span className="text-sm font-semibold text-green-600">
              已加入 {addedToDay.replace('-', '月') + '日'}
            </span>
            <button onClick={() => { setAddedToDay(null); setShowDayPicker(false); }} className="text-xs text-gray-400 ml-2">更换</button>
          </div>
        ) : (
          /* 选择天数 */
          <div>
            <p className="text-xs text-gray-500 mb-2 text-center">选择加入哪天</p>
            {sortedDateKeys.length === 0 ? (
              <button
                onClick={() => navigate('/trip-planner')}
                className="w-full py-3 rounded-2xl bg-[#FBE451] text-[#333] font-bold text-sm"
              >
                去行程规划设置日期
              </button>
            ) : (
              <div className="flex gap-2 flex-wrap justify-center">
                {sortedDateKeys.map((key) => {
                  const [m, d] = key.split('-');
                  const already = (tripDateItems[key] || []).some(i => i.id === merchant.id);
                  return (
                    <button
                      key={key}
                      disabled={already}
                      onClick={() => handleAddToDay(key)}
                      className={`px-4 py-2 rounded-full text-xs font-semibold border transition-all ${
                        already ? 'bg-gray-100 text-gray-400 border-gray-200' : 'bg-[#FBE451] border-[#FBE451] text-[#333]'
                      }`}
                    >
                      {already ? '✓ ' : ''}{m}月{d}日
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MerchantDetail;
