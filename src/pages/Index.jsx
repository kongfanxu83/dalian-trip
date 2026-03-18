import { useCart } from '../hooks/useCart.js';
import BottomNavigation from '../components/BottomNavigation.jsx';
import TopNavigation from '../components/TopNavigation.jsx';
import DatabaseMerchantCard from '../components/DatabaseMerchantCard.jsx';
import { useMerchantData } from '../hooks/useMerchantData.js';
import { MapPin, ShoppingBag, X } from 'lucide-react';
import React, { useRef, useState, useEffect } from 'react';

const CATEGORIES = [
  { key: '美食', label: '必吃榜', icon: '🍜', color: 'from-orange-400 to-red-400' },
  { key: '景点', label: '必游榜', icon: '🏯', color: 'from-blue-400 to-cyan-400' },
  { key: '酒店', label: '必住榜', icon: '🏨', color: 'from-purple-400 to-pink-400' },
  { key: '购物', label: '必逛榜', icon: '🛍️', color: 'from-green-400 to-teal-400' },
  { key: '娱乐', label: '必玩榜', icon: '🎭', color: 'from-yellow-400 to-orange-400' },
];

const Index = () => {
  const [category, setCategory] = useState('美食');
  const [isCartExpanded, setIsCartExpanded] = useState(false);
  const [favoriteItems, setFavoriteItems] = useState([]);
  const cartRef = useRef(null);

  const { cartItems, addToCart, updatePeopleCount, removeFromCart, getCartTotal, isInCart, getPeopleCount, completeCart } = useCart();
  const { useRankingList } = useMerchantData();
  const { data: merchants = [], isLoading, error } = useRankingList(category);

  useEffect(() => {
    const saved = localStorage.getItem('favoriteItems');
    if (saved) setFavoriteItems(JSON.parse(saved));
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      if (cartRef.current && !cartRef.current.contains(e.target) && isCartExpanded) {
        setIsCartExpanded(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [isCartExpanded]);

  const handleFavoriteClick = (merchant) => {
    const isFav = favoriteItems.some(i => i.id === merchant.id);
    const updated = isFav ? favoriteItems.filter(i => i.id !== merchant.id) : [...favoriteItems, merchant];
    setFavoriteItems(updated);
    localStorage.setItem('favoriteItems', JSON.stringify(updated));
  };

  const activeCat = CATEGORIES.find(c => c.key === category);

  if (isLoading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400 mx-auto mb-3" />
        <p className="text-gray-500 text-sm">加载中...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <p className="text-red-400 mb-4">加载失败</p>
        <button onClick={() => window.location.reload()} className="px-5 py-2 bg-yellow-400 text-gray-800 rounded-full font-medium">重新加载</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNavigation />

      <div className="pt-20 pb-32">
        {/* Hero Banner */}
        <div className="bg-gradient-to-br from-yellow-400 via-yellow-300 to-orange-300 px-4 pt-4 pb-6">
          <div className="flex items-center mb-1">
            <MapPin className="w-4 h-4 text-orange-600 mr-1" />
            <span className="text-orange-700 text-sm font-medium">大连 · 精选榜单</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-1">发现大连之美</h1>
          <p className="text-orange-700 text-sm">精选本地必去打卡地，开启你的专属旅程</p>
        </div>

        {/* 分类 Tab */}
        <div className="bg-white shadow-sm px-4 py-3 flex space-x-2 overflow-x-auto scrollbar-hide -mt-1">
          {CATEGORIES.map(cat => (
            <button
              key={cat.key}
              onClick={() => setCategory(cat.key)}
              className={`flex-shrink-0 flex items-center space-x-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                category === cat.key
                  ? 'bg-yellow-400 text-gray-800 shadow-md scale-105'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* 榜单标题栏 */}
        <div className="px-4 py-3 flex items-center justify-between">
          <span className="font-bold text-gray-800 text-base">{activeCat?.label}</span>
          <span className="text-gray-400 text-sm">{merchants.length}家</span>
        </div>

        {/* 商家列表 */}
        <div className="px-4 space-y-3">
          {merchants.length > 0 ? (
            merchants.map((merchant, index) => (
              <div key={merchant.id} className="relative">
                {index < 3 && (
                  <div className={`absolute -left-1 top-3 z-10 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold shadow ${
                    index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-orange-400'
                  }`}>
                    {index + 1}
                  </div>
                )}
                <DatabaseMerchantCard
                  merchant={merchant}
                  onAddClick={addToCart}
                  onPeopleCountChange={updatePeopleCount}
                  isInCart={isInCart(merchant.id)}
                  cartPeopleCount={getPeopleCount(merchant.id)}
                  onFavoriteClick={handleFavoriteClick}
                  isFavorited={favoriteItems.some(i => i.id === merchant.id)}
                />
              </div>
            ))
          ) : (
            <div className="text-center py-16">
              <div className="text-5xl mb-3">🔍</div>
              <p className="text-gray-400">暂无{category}榜单数据</p>
            </div>
          )}
        </div>
      </div>

      {/* 购物车栏 */}
      <div
        ref={cartRef}
        className="fixed bottom-14 left-0 right-0 z-40 shadow-lg"
        onClick={() => setIsCartExpanded(!isCartExpanded)}
      >
        {/* 展开详情 */}
        {isCartExpanded && (
          <div className="bg-white border-t border-gray-100 max-h-64 overflow-y-auto" onClick={e => e.stopPropagation()}>
            {cartItems.length > 0 ? cartItems.map(item => (
              <div key={item.id} className="flex items-center justify-between px-4 py-3 border-b border-gray-50">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-lg overflow-hidden mr-3 flex-shrink-0">
                    <img
                      src={item.image_url || `https://nocode.meituan.com/photo/search?keyword=${item.name}&width=80&height=80`}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-gray-800 font-medium text-sm">{item.name}</p>
                    <p className="text-gray-400 text-xs">{item.peopleCount}人</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-gray-700 text-sm font-medium">{item.price || '免费'}</span>
                  <button onClick={() => removeFromCart(item.id)} className="text-gray-300 hover:text-red-400 transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )) : (
              <div className="px-4 py-6 text-center text-gray-400 text-sm">还没有添加地点</div>
            )}
          </div>
        )}

        {/* 底部栏 */}
        <div className="bg-white border-t border-gray-100 px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <ShoppingBag className="w-6 h-6 text-gray-700" />
              {cartItems.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                  {cartItems.length}
                </span>
              )}
            </div>
            <div>
              <p className="text-gray-800 font-medium text-sm">{cartItems.length > 0 ? `已选 ${cartItems.length} 个地点` : '还没有选择地点'}</p>
              {cartItems.length > 0 && <p className="text-gray-400 text-xs">预估 ¥{getCartTotal()}</p>}
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (cartItems.length > 0) completeCart();
            }}
            className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
              cartItems.length > 0
                ? 'bg-yellow-400 text-gray-800 shadow-md active:scale-95'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            去规划
          </button>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Index;
