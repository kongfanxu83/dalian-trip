import { useCart } from '../hooks/useCart.js';
import BottomNavigation from './BottomNavigation.jsx';
import MerchantCard from './MerchantCard.jsx';
import { Search, ChevronDown } from 'lucide-react';
import React, { useState } from 'react';
import CitySelector from './CitySelector.jsx';

const VirtualMap = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('美食');
  const [selectedMerchant, setSelectedMerchant] = useState(null);
  const [favoriteItems, setFavoriteItems] = useState([]);
  const [showCitySelector, setShowCitySelector] = useState(false);

  // 使用共享的购物车 Hook
  const {
    cartItems,
    addToCart,
    updatePeopleCount,
    isInCart,
    getPeopleCount
  } = useCart();

  // 从本地存储加载收藏和购物车数据
  React.useEffect(() => {
    const savedFavorites = localStorage.getItem('favoriteItems');
    if (savedFavorites) {
      setFavoriteItems(JSON.parse(savedFavorites));
    }
  }, []);

  // 模拟的商家数据
  const merchants = {
    '美食': [
      {
        id: 1,
        name: '里弄里私房餐饮店',
        rating: '4.8',
        price: '89',
        area: '中山区',
        tag: '人气推荐',
        favoriteCount: '3241',
        position: { top: '25%', left: '45%' }
      },
      {
        id: 2,
        name: '洛洋糯禧糕·麻糍·奶酪小方',
        rating: '4.9',
        price: '65',
        area: '甘井子区',
        tag: '必吃美食',
        favoriteCount: '4521',
        position: { top: '28%', left: '42%' }
      },
      {
        id: 3,
        name: '小肋条烤肉自助',
        rating: '4.7',
        price: '25',
        area: '高新区',
        tag: '地方特色',
        favoriteCount: '2876',
        position: { top: '55%', left: '35%' }
      },
      {
        id: 4,
        name: '名扬烤吧(星海孙家沟店)',
        rating: '4.6',
        price: '120',
        area: '沙河口区',
        tag: '人气推荐',
        favoriteCount: '1892',
        position: { top: '70%', left: '33%' }
      },
      {
        id: 5,
        name: '蒸鲜·海麻线包子',
        rating: '4.5',
        price: '35',
        area: '西岗区',
        tag: '地方特色',
        favoriteCount: '1543',
        position: { top: '65%', right: '35%' }
      }
    ],
    '景点': [
      {
        id: 6,
        name: '星海广场',
        rating: '4.7',
        price: '0',
        area: '沙河口区',
        tag: '必游景点',
        favoriteCount: '8967',
        position: { top: '40%', left: '50%' }
      },
      {
        id: 7,
        name: '老虎滩海洋公园',
        rating: '4.8',
        price: '198',
        area: '中山区',
        tag: '亲子推荐',
        favoriteCount: '6543',
        position: { top: '60%', left: '25%' }
      }
    ],
    '酒店': [
      {
        id: 8,
        name: '香格里拉大酒店',
        rating: '4.9',
        price: '688',
        area: '中山区',
        tag: '豪华住宿',
        favoriteCount: '2156',
        position: { top: '30%', right: '30%' }
      },
      {
        id: 9,
        name: '大连富丽华大酒店',
        rating: '4.8',
        price: '588',
        area: '西岗区',
        tag: '商务首选',
        favoriteCount: '1876',
        position: { top: '45%', right: '25%' }
      }
    ]
  };

  // 处理收藏点击
  const handleFavoriteClick = (merchant) => {
    const isFavorited = favoriteItems.some(item => item.id === merchant.id);
    
    let updatedFavorites;
    if (isFavorited) {
      updatedFavorites = favoriteItems.filter(item => item.id !== merchant.id);
    } else {
      updatedFavorites = [...favoriteItems, merchant];
    }
    
    setFavoriteItems(updatedFavorites);
    localStorage.setItem('favoriteItems', JSON.stringify(updatedFavorites));
  };

  // 检查商家是否已收藏
  const isMerchantFavorited = (merchantId) => {
    return favoriteItems.some(item => item.id === merchantId);
  };

  // 处理城市选择
  const handleCityClick = () => {
    setShowCitySelector(true);
  };

  const handleBackFromCitySelector = () => {
    setShowCitySelector(false);
  };

  if (showCitySelector) {
    return <CitySelector onBack={handleBackFromCitySelector} />;
  }

  return (
    <div className="min-h-screen bg-[#F4F4F4]">
      {/* 顶部导航栏 */}
      <div className="fixed top-0 left-0 right-0 h-15 bg-[#FBE451] z-50 px-4 py-2">
        <div className="flex items-center justify-between h-full">
          {/* 左侧城市选择 */}
          <div className="flex items-center space-x-2">
            <button 
              onClick={handleCityClick}
              className="flex items-center text-[#333333] font-bold hover:text-[#FBE451] transition-colors"
            >
              大连
              <ChevronDown className="w-4 h-4 ml-1" />
            </button>
          </div>
          
          <h1 className="text-lg font-bold text-[#333333]">地图</h1>
          <div className="w-12"></div>
        </div>
      </div>

      {/* 搜索框 */}
      <div className="pt-16 px-4 pb-2">
        <div className="flex items-center p-3 bg-white rounded-lg shadow-sm">
          <div className="flex-1 relative">
            <input 
              type="text" 
              placeholder="搜索地点、景点、美食"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-2 px-3 rounded-lg bg-[#F4F4F4] focus:outline-none"
            />
          </div>
          <button className="ml-2 px-4 py-2 bg-[#FBE451] text-[#333333] rounded-lg font-medium">
            搜索
          </button>
        </div>
      </div>

      {/* 分类选择 */}
      <div className="px-4 pb-2">
        <div className="flex space-x-2">
          {['美食', '景点', '酒店'].map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-md text-sm font-bold whitespace-nowrap transition-all duration-200 ${
                activeCategory === category
                  ? 'bg-[#FBE451] text-[#333333]'
                  : 'bg-white text-[#666666]'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* 虚拟地图容器 */}
      <div className="px-4 pb-4">
        <div className="w-full h-64 rounded-lg overflow-hidden border border-gray-200 relative">
          {/* 使用您提供的图片作为地图背景 */}
          <img 
            src="https://s3plus.meituan.net/nocode-external/nocode_image/default/IMG_20260308_021948-kfstlew97clr0i1c4rkg6mks1sdope.jpg" 
            alt="地图背景"
            className="w-full h-full object-cover"
          />
          
          {/* 在地图上叠加商家标记点 */}
          {merchants[activeCategory].map((merchant) => {
            const isFavorited = isMerchantFavorited(merchant.id);
            
            return (
              <div
                key={merchant.id}
                className="absolute w-8 h-8 flex items-center justify-center cursor-pointer transform -translate-x-1/2 -translate-y-1/2"
                style={{ 
                  top: merchant.position.top, 
                  left: merchant.position.left,
                  right: merchant.position.right
                }}
                onClick={() => setSelectedMerchant(merchant)}
              >
                {isFavorited ? (
                  <span className="text-yellow-400 text-2xl">⭐</span>
                ) : (
                  <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white text-xs">📍</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 商家卡片 */}
      {selectedMerchant && (
        <div className="px-4 pb-4">
          <MerchantCard 
            merchant={selectedMerchant}
            onAddClick={addToCart}
            onPeopleCountChange={updatePeopleCount}
            isInCart={isInCart(selectedMerchant.id)}
            cartPeopleCount={getPeopleCount(selectedMerchant.id)}
            onFavoriteClick={handleFavoriteClick}
            isFavorited={isMerchantFavorited(selectedMerchant.id)}
          />
        </div>
      )}

      {/* 底部导航栏 */}
      <BottomNavigation />
    </div>
  );
};

export default VirtualMap;
