import { Heart, Star, Plus, Minus } from 'lucide-react';
import React, { useState } from 'react';
const MerchantCard = ({ merchant, onAddClick, onPeopleCountChange, isInCart, cartPeopleCount, onFavoriteClick, isFavorited }) => {
  const [showPeopleSelector, setShowPeopleSelector] = useState(false);
  const [localPeopleCount, setLocalPeopleCount] = useState(cartPeopleCount || 1);

  const handleFavorite = () => {
    // 调用父组件的收藏处理函数
    onFavoriteClick(merchant);
  };

  const handleAddToList = () => {
    // 调用父组件的回调函数，传递当前商家和人数
    onAddClick(merchant, localPeopleCount);
    // 显示人数选择器
    setShowPeopleSelector(true);
  };

  // 本地人数增减处理
  const handleIncrement = () => {
    const newCount = localPeopleCount + 1;
    setLocalPeopleCount(newCount);
    // 如果已经在购物车中，更新购物车人数
    if (isInCart) {
      onPeopleCountChange(merchant.id, newCount);
    }
  };

  const handleDecrement = () => {
    if (localPeopleCount > 1) {
      const newCount = localPeopleCount - 1;
      setLocalPeopleCount(newCount);
      // 如果已经在购物车中，更新购物车人数
      if (isInCart) {
        onPeopleCountChange(merchant.id, newCount);
      }
    } else if (localPeopleCount === 1 && isInCart) {
      // 当人数为1且已在购物车中时，点击减号从购物车删除
      onPeopleCountChange(merchant.id, 0); // 传递0表示删除
      setShowPeopleSelector(false); // 隐藏人数选择器
    }
  };

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

  // 格式化收藏数显示
  const formatFavoriteCount = (count) => {
    if (count >= 10000) {
      return `${(count / 10000).toFixed(1)}w`;
    }
    return count.toString();
  };

  return (
    <div className="mb-4 bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200 relative">
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
            <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
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
        onClick={handleFavorite}
        className="absolute top-3 right-3 flex items-center"
      >
        <Heart 
          className={`w-5 h-5 ${
            isFavorited ? 'text-yellow-400 fill-current' : 'text-gray-400'
          }`} 
        />
        {merchant.favoriteCount && (
          <span className="ml-1 text-xs text-gray-500">
            {formatFavoriteCount(parseInt(merchant.favoriteCount))}
          </span>
        )}
      </button>
      {/* 加购按钮 */}
      {isInCart || showPeopleSelector ? (
        <div className="absolute bottom-3 right-3 flex items-center bg-[#F5F5F5] border border-[#FFF9E6] rounded-lg px-2 py-1">
          <button 
            onClick={handleDecrement}
            className="text-black font-bold text-lg px-1"
            disabled={localPeopleCount < 1}
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="text-black font-medium mx-1 text-sm">{localPeopleCount}</span>
          <button 
            onClick={handleIncrement}
            className="text-black font-bold text-lg px-1"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <button 
          onClick={handleAddToList}
          className="absolute bottom-3 right-3 w-8 h-8 bg-[#FBE451] rounded-full flex items-center justify-center text-[#333333]"
        >
          <Plus className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

export default MerchantCard;
