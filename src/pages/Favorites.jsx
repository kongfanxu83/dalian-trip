import { useCart } from '../hooks/useCart.js';
import CitySelector from '../components/CitySelector.jsx';
import { Heart, ChevronLeft, ChevronDown } from 'lucide-react';
import BottomNavigation from '../components/BottomNavigation.jsx';
import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Favorites = () => {
  // 从本地存储获取收藏列表
  const [favoriteItems, setFavoriteItems] = useState([]);
  const [isCartExpanded, setIsCartExpanded] = useState(false);
  const [activeFilter, setActiveFilter] = useState('全部');
  const [showCitySelector, setShowCitySelector] = useState(false);
  const cartRef = useRef(null);
  const navigate = useNavigate();

  // 使用共享的购物车 Hook
  const {
    cartItems,
    addToCart,
    updatePeopleCount,
    removeFromCart,
    getCartTotal,
    isInCart,
    getPeopleCount
  } = useCart();

  React.useEffect(() => {
    // 从本地存储加载收藏数据
    const savedFavorites = localStorage.getItem('favoriteItems');
    if (savedFavorites) {
      setFavoriteItems(JSON.parse(savedFavorites));
    }
  }, []);

  // 获取商家图片URL
  const getMerchantImageUrl = (merchantName) => {
    if (merchantName === '大连海鲜大排档') {
      return 'https://s3plus.meituan.net/nocode-external/nocode_image/default/正黄旗-fdj4o9i6x9pf4poeklcmobn00i1l8i.jpg';
    } else if (merchantName === '老边饺子馆') {
      return 'https://s3plus.meituan.net/nocode-external/nocode_image/default/水饺-j1pq10lxtedtfz9beeiv7twfwn2l21.jpg';
    } else if (merchantName === '大连焖子') {
      return 'https://s3plus.meituan.net/nocode-external/nocode_image/default/焖子-eevura063loby8wtojg3jkrjp1zwvo.jpg';
    } else {
      return `https://nocode.meituan.com/photo/search?keyword=${merchantName}&width=100&height=100`;
    }
  };

  // 处理取消收藏
  const handleRemoveFavorite = (merchantId) => {
    const updatedFavorites = favoriteItems.filter(item => item.id !== merchantId);
    setFavoriteItems(updatedFavorites);
    // 更新本地存储
    localStorage.setItem('favoriteItems', JSON.stringify(updatedFavorites));
  };

  // 添加到购物车
  const handleAddToCart = (merchant, peopleCount = 1) => {
    addToCart(merchant, peopleCount);
  };

  // 处理人数变化 - 更新以支持删除功能
  const handlePeopleCountChange = (merchantId, newCount) => {
    updatePeopleCount(merchantId, newCount);
  };

  // 删除购物车中的商家
  const handleRemoveFromCart = (merchantId) => {
    removeFromCart(merchantId);
  };

  // 检查商家是否已在购物车中
  const isMerchantInCart = (merchantId) => {
    return isInCart(merchantId);
  };

  // 获取购物车中商家的人数
  const getCartPeopleCount = (merchantId) => {
    return getPeopleCount(merchantId);
  };

  // 切换购物车展开状态
  const toggleCartExpansion = () => {
    setIsCartExpanded(!isCartExpanded);
  };

  // 根据筛选条件过滤收藏商家
  const getFilteredFavorites = () => {
    if (activeFilter === '全部') {
      return favoriteItems;
    } else if (activeFilter === '美食') {
      // 必吃榜商家:包含"必吃美食"、"人气推荐"、"地方特色"标签
      return favoriteItems.filter(item => 
        item.tag === '必吃美食' || item.tag === '人气推荐' || item.tag === '地方特色'
      );
    } else if (activeFilter === '景点') {
      // 必玩榜商家:包含"必游景点"、"亲子推荐"、"自然风光"标签
      return favoriteItems.filter(item => 
        item.tag === '必游景点' || item.tag === '亲子推荐' || item.tag === '自然风光'
      );
    } else if (activeFilter === '酒店') {
      // 必住榜商家:包含"豪华住宿"、"商务首选"、"海景房"标签
      return favoriteItems.filter(item => 
        item.tag === '豪华住宿' || item.tag === '商务首选' || item.tag === '海景房'
      );
    }
    return favoriteItems;
  };

  const filteredFavorites = getFilteredFavorites();

  // 处理城市选择
  const handleCityClick = () => {
    setShowCitySelector(true);
  };

  const handleBackFromCitySelector = () => {
    setShowCitySelector(false);
  };

  // 格式化收藏数显示
  const formatFavoriteCount = (count) => {
    if (count >= 10000) {
      return `${(count / 10000).toFixed(1)}w`;
    }
    return count.toString();
  };

  // 点击空白区域关闭购物车详情
  const handleClickOutside = (event) => {
    if (cartRef.current && !cartRef.current.contains(event.target) && isCartExpanded) {
      setIsCartExpanded(false);
    }
  };

  // 添加全局点击事件监听器
  React.useEffect(() => {
    if (isCartExpanded) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isCartExpanded]);

  // 处理"完成"按钮点击 - 跳转到行程规划页面
  const handleComplete = () => {
    navigate('/trip-planner');
  };

  // 处理返回按钮点击
  const handleBack = () => {
    navigate('/profile');
  };

  if (showCitySelector) {
    return <CitySelector onBack={handleBackFromCitySelector} />;
  }

  return (
    <div className="min-h-screen bg-[#F4F4F4] pb-16">
      {/* 顶部导航栏 */}
      <div className="fixed top-0 left-0 right-0 h-15 bg-[#FBE451] z-50 px-4 py-2">
        <div className="flex items-center justify-between h-full">
          <button 
            onClick={handleBack}
            className="flex items-center text-[#333333] font-bold"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="ml-1">返回</span>
          </button>
          <h1 className="text-lg font-bold text-[#333333]">我的收藏</h1>
          <div className="w-12"></div>
        </div>
      </div>

      {/* 分类导航栏 - 在筛选栏上方添加空白行 */}
      <div className="bg-white border-b border-gray-100 mt-15 pt-6 pb-0">
        {/* 添加一行空白高度 */}
        <div className="h-6"></div>
        <div className="flex overflow-x-auto px-4 items-end h-full">
          {['全部', '美食', '景点', '酒店'].map((filter) => (
            <button 
              key={filter} 
              className={`whitespace-nowrap px-4 pb-2 mr-2 text-sm border-b-2 ${
                activeFilter === filter 
                  ? 'text-[#FBE451] border-[#FBE451]' 
                  : 'text-[#666666] border-transparent'
              }`}
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* 收藏列表内容 - 增加顶部间距避免被导航栏遮挡 */}
      <div className="flex-1 overflow-y-auto pb-32 pt-4">
        {filteredFavorites.length > 0 ? (
          <div>
            {filteredFavorites.map((merchant) => (
              <div key={merchant.id} className="mb-4 bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200 relative">
                <div className="flex">
                  <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 my-3 ml-3">
                    <img 
                      src={getMerchantImageUrl(merchant.name)}
                      alt={merchant.name}
                      className="w-full h-full mx-auto object-cover"
                    />
                  </div>
                  <div className="flex-1 p-3">
                    <div className="font-bold text-[#333333] mb-1">{merchant.name}</div>
                    <div className="flex items-center mb-1">
                      <span className="text-yellow-500 text-sm mr-1">★</span>
                      <span className="font-bold text-[#333333] text-sm">{merchant.rating}</span>
                      {merchant.price && merchant.price !== '0' && (
                        <span className="text-green-500 ml-2 text-xs">¥{merchant.price}/人</span>
                      )}
                    </div>
                    <div className="text-xs text-gray-600 mb-1">{merchant.tag}</div>
                    {merchant.area && (
                      <div className="text-xs text-gray-500 mb-2">{merchant.area}</div>
                    )}
                  </div>
                </div>
                {/* 收藏按钮 */}
                <button 
                  onClick={() => handleRemoveFavorite(merchant.id)}
                  className="absolute top-3 right-3 flex items-center"
                >
                  <Heart className="w-5 h-5 text-yellow-400 fill-current" />
                  {merchant.favoriteCount && (
                    <span className="ml-1 text-xs text-gray-500">
                      {formatFavoriteCount(parseInt(merchant.favoriteCount))}
                    </span>
                  )}
                </button>
                {/* 加购按钮 */}
                {isMerchantInCart(merchant.id) ? (
                  <div className="absolute bottom-3 right-3 flex items-center bg-[#F5F5F5] border border-[#FFF9E6] rounded-lg px-2 py-1">
                    <button 
                      onClick={() => handlePeopleCountChange(merchant.id, getCartPeopleCount(merchant.id) - 1)}
                      className="text-black font-bold text-lg px-1"
                      disabled={getCartPeopleCount(merchant.id) < 1}
                    >
                      -
                    </button>
                    <span className="text-black font-medium mx-1 text-sm">{getCartPeopleCount(merchant.id)}</span>
                    <button 
                      onClick={() => handlePeopleCountChange(merchant.id, getCartPeopleCount(merchant.id) + 1)}
                      className="text-black font-bold text-lg px-1"
                    >
                      +
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => handleAddToCart(merchant)}
                    className="absolute bottom-3 right-3 w-8 h-8 bg-[#FBE451] rounded-full flex items-center justify-center text-[#333333]"
                  >
                    <span className="text-lg">+</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full px-4 pt-20">
            <Heart className="w-16 h-16 text-gray-400 mb-4" />
            <h2 className="text-xl font-bold text-[#333333] mb-2">收藏夹</h2>
            <p className="text-[#999999] text-center">
              {activeFilter === '全部' 
                ? '您还没有收藏任何商家\n快去发现喜欢的商家吧!' 
                : `您还没有收藏${activeFilter}类商家`}
            </p>
          </div>
        )}
      </div>

      {/* 加购栏 */}
      <div 
        ref={cartRef}
        className="fixed bottom-14 left-0 right-0 bg-white border-t border-gray-200"
        onClick={toggleCartExpansion}
      >
        {/* 加购栏头部 */}
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center">
            <span className="text-xl mr-2">📋</span>
            <span className="text-[#333333] font-medium">
              {cartItems.length > 0 ? `${cartItems.length}个地点` : '0个地点'}
            </span>
          </div>
          <div className="flex items-center">
            <span className="text-[#333333] text-sm mr-2">
              预估￥{cartItems.length > 0 ? getCartTotal() : 0}
            </span>
            <button 
              className="text-[#333333] text-sm font-medium mr-2"
              onClick={(e) => {
                e.stopPropagation();
                toggleCartExpansion();
              }}
            >
              {isCartExpanded ? '关闭' : '详情'}
            </button>
            <button 
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                cartItems.length > 0 
                  ? 'bg-[#FBE451] text-[#333333]' 
                  : 'bg-gray-300 text-gray-500'
              }`}
              onClick={(e) => {
                e.stopPropagation();
                handleComplete();
              }}
            >
              完成
            </button>
          </div>
        </div>
        
        {/* 展开的加购详情 */}
        {isCartExpanded && (
          <div className="border-t border-gray-200 max-h-60 overflow-y-auto">
            {cartItems.length > 0 ? (
              cartItems.map((item) => (
                <div 
                  key={item.id} 
                  className="flex items-center justify-between px-4 py-3 border-b border-gray-100"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-md overflow-hidden mr-3">
                      <img 
                        src={getMerchantImageUrl(item.name)}
                        alt={item.name}
                        className="w-full h-full mx-auto object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="text-[#333333] font-medium text-sm">{item.name}</h4>
                      <p className="text-[#999999] text-xs">{item.peopleCount}人</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="text-[#333333] font-medium mr-3">
                      ¥{item.price || 0}
                    </div>
                    <button 
                      onClick={() => handleRemoveFromCart(item.id)}
                      className="text-red-500 text-sm font-medium"
                    >
                      删除
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-4 py-6 text-center text-[#999999]">
                暂无加购商家
              </div>
            )}
          </div>
        )}
      </div>

      {/* 底部导航栏 */}
      <BottomNavigation />
    </div>
  );
};

export default Favorites;
