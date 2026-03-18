import { Heart, Star, Plus, Minus, MapPin, Phone, Clock } from 'lucide-react';
import React, { useState } from 'react';
import { useCart } from '../hooks/useCart';
import { useNavigate } from 'react-router-dom';

const DatabaseMerchantCard = ({
  merchant,
  onAddClick,
  onPeopleCountChange,
  isInCart,
  cartPeopleCount,
  onFavoriteClick,
  isFavorited,
  showLocation = true
}) => {
  const navigate = useNavigate();
  const [showPeopleSelector, setShowPeopleSelector] = useState(false);
  const [localPeopleCount, setLocalPeopleCount] = useState(cartPeopleCount || 1);
  const { addToCart, updatePeopleCount, isInCart: checkInCart, getPeopleCount } = useCart();

  const handleFavorite = () => {
    onFavoriteClick(merchant);
  };

  const handleAddToList = () => {
    onAddClick(merchant, localPeopleCount);
    setShowPeopleSelector(true);
  };

  const handleIncrement = () => {
    const newCount = localPeopleCount + 1;
    setLocalPeopleCount(newCount);
    if (isInCart) {
      onPeopleCountChange(merchant.id, newCount);
    }
  };

  const handleDecrement = () => {
    if (localPeopleCount > 1) {
      const newCount = localPeopleCount - 1;
      setLocalPeopleCount(newCount);
      if (isInCart) {
        onPeopleCountChange(merchant.id, newCount);
      }
    } else if (localPeopleCount === 1 && isInCart) {
      onPeopleCountChange(merchant.id, 0);
      setShowPeopleSelector(false);
    }
  };

  const formatFavoriteCount = (count) => {
    if (count >= 10000) {
      return `${(count / 10000).toFixed(1)}w`;
    }
    return count.toString();
  };

  const formatPrice = (price) => {
    if (!price || price === '0' || price === '免费') return '免费';
    return price;
  };

  return (
    <div
      className="mb-4 bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200 relative cursor-pointer active:scale-[0.99] transition-transform"
      onClick={() => navigate(`/merchant/${merchant.id}`)}
    >
      <div className="flex">
        <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 my-3 ml-3">
          <img 
            src={merchant.image_url || `https://nocode.meituan.com/photo/search?keyword=${merchant.name}&width=100&height=100`}
            alt={merchant.name}
            className="w-full h-full mx-auto object-cover"
          />
        </div>
        <div className="flex-1 p-3">
          <div className="font-bold text-[#333333] mb-1">{merchant.name}</div>
          
          <div className="flex items-center mb-1">
            <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
            <span className="font-bold text-[#333333] text-sm">{merchant.rating}</span>
            <span className="text-green-500 ml-2 text-xs">{formatPrice(merchant.price)}</span>
          </div>
          
          <div className="text-xs text-gray-600 mb-1">{merchant.tag}</div>
          
          {showLocation && merchant.area && (
            <div className="text-xs text-gray-500 mb-1 flex items-center">
              <MapPin className="w-3 h-3 mr-1" />
              {merchant.area}
            </div>
          )}
          
          {merchant.address && (
            <div className="text-xs text-gray-500 mb-1 truncate">
              {merchant.address}
            </div>
          )}
          
          {merchant.phone && (
            <div className="text-xs text-gray-500 mb-1 flex items-center">
              <Phone className="w-3 h-3 mr-1" />
              {merchant.phone}
            </div>
          )}
          
          {merchant.business_hours && (
            <div className="text-xs text-gray-500 flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              {merchant.business_hours}
            </div>
          )}
        </div>
      </div>
      
      {/* 收藏按钮 */}
      <button
        onClick={(e) => { e.stopPropagation(); handleFavorite(); }}
        className="absolute top-3 right-3 flex items-center"
      >
        <Heart 
          className={`w-5 h-5 ${
            isFavorited ? 'text-yellow-400 fill-current' : 'text-gray-400'
          }`} 
        />
        {merchant.favorite_count && (
          <span className="ml-1 text-xs text-gray-500">
            {formatFavoriteCount(merchant.favorite_count)}
          </span>
        )}
      </button>
      
      {/* 加购按钮 */}
      {isInCart || showPeopleSelector ? (
        <div
          className="absolute bottom-3 right-3 flex items-center bg-[#F5F5F5] border border-[#FFF9E6] rounded-lg px-2 py-1"
          onClick={e => e.stopPropagation()}
        >
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
          onClick={(e) => { e.stopPropagation(); handleAddToList(); }}
          className="absolute bottom-3 right-3 w-8 h-8 bg-[#FBE451] rounded-full flex items-center justify-center text-[#333333]"
        >
          <Plus className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

export default DatabaseMerchantCard;
