import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MessageCircle, ChevronDown } from 'lucide-react';
import CitySelector from './CitySelector.jsx';
import { useMerchantData } from '../hooks/useMerchantData.js';

const TopNavigation = () => {
  const [showCitySelector, setShowCitySelector] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleCityClick = () => {
    setShowCitySelector(true);
  };

  const handleBackFromCitySelector = () => {
    setShowCitySelector(false);
  };

  const handleSearchClick = () => {
    // 直接跳转到搜索页面，不传递搜索词
    navigate('/search');
  };

  if (showCitySelector) {
    return <CitySelector onBack={handleBackFromCitySelector} />;
  }

  return (
    <div className="fixed top-0 left-0 right-0 h-15 bg-[#FBE451] z-50 px-4 py-2">
      <div className="flex flex-col h-full">
        {/* 第一行:返回按钮和城市 */}
        <div className="flex items-center justify-between w-full">
          {/* 左侧返回按钮和城市选择 */}
          <div className="flex items-center space-x-2">
            <button 
              onClick={handleCityClick}
              className="flex items-center text-[#333333] font-bold hover:text-[#FBE451] transition-colors"
            >
              大连
              <ChevronDown className="w-4 h-4 ml-1" />
            </button>
          </div>

          {/* 右侧消息图标 - 在移动端隐藏 */}
          <div className="hidden">
            <MessageCircle className="w-6 h-6 text-[#333333]" />
          </div>
        </div>

        {/* 第二行:搜索框 */}
        <div className="flex-1 flex items-center mt-2">
          <div 
            className="bg-white rounded-md h-9 flex items-center px-3 shadow-sm w-full cursor-pointer"
            onClick={handleSearchClick}
          >
            <Search className="w-4 h-4 text-[#999999] mr-2" />
            <span className="flex-1 text-[#999999] text-sm">例:餐厅</span>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                handleSearchClick();
              }}
              className="ml-auto bg-[#FBE451] text-white px-3 py-1 rounded-md text-sm"
            >
              搜索
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopNavigation;
