import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, MapPin, Trash2, Star } from 'lucide-react';
import BottomNavigation from '../components/BottomNavigation.jsx';
import { useCart } from '../hooks/useCart.js';

const Footprint = () => {
  const navigate = useNavigate();
  const [footprintItems, setFootprintItems] = useState([]);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const { addToCart, updatePeopleCount, isInCart, getPeopleCount } = useCart();

  // 从本地存储加载足迹数据
  useEffect(() => {
    const savedFootprints = localStorage.getItem('footprintItems');
    if (savedFootprints) {
      setFootprintItems(JSON.parse(savedFootprints));
    }
  }, []);

  const handleBack = () => {
    navigate('/profile');
  };

  // 清空足迹
  const handleClearFootprints = () => {
    setShowClearConfirm(true);
  };

  const confirmClear = () => {
    setFootprintItems([]);
    localStorage.setItem('footprintItems', JSON.stringify([]));
    setShowClearConfirm(false);
  };

  const cancelClear = () => {
    setShowClearConfirm(false);
  };

  // 删除单个足迹
  const handleDeleteFootprint = (merchantId) => {
    const updatedFootprints = footprintItems.filter(item => item.id !== merchantId);
    setFootprintItems(updatedFootprints);
    localStorage.setItem('footprintItems', JSON.stringify(updatedFootprints));
  };

  // 添加到购物车
  const handleAddToCart = (merchant) => {
    addToCart(merchant, 1);
  };

  // 处理人数变化
  const handlePeopleCountChange = (merchantId, newCount) => {
    updatePeopleCount(merchantId, newCount);
  };

  // 格式化时间显示
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    // 小于1小时
    if (diff < 3600000) {
      const minutes = Math.floor(diff / 60000);
      return `${minutes}分钟前`;
    }
    
    // 小于24小时
    if (diff < 86400000) {
      const hours = Math.floor(diff / 3600000);
      return `${hours}小时前`;
    }
    
    // 小于7天
    if (diff < 604800000) {
      const days = Math.floor(diff / 86400000);
      return `${days}天前`;
    }
    
    // 超过7天显示具体日期
    return `${date.getMonth() + 1}月${date.getDate()}日`;
  };

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
          <h1 className="text-lg font-bold text-[#333333]">我的足迹</h1>
          {footprintItems.length > 0 && (
            <button 
              onClick={handleClearFootprints}
              className="text-[#333333] text-sm"
            >
              清空
            </button>
          )}
          {footprintItems.length === 0 && <div className="w-12"></div>}
        </div>
      </div>

      {/* 主要内容区域 */}
      <div className="pt-20 px-4">
        {footprintItems.length > 0 ? (
          <div>
            {footprintItems.map((merchant) => (
              <div key={merchant.id} className="mb-4 bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200 relative">
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
                      {merchant.price && merchant.price !== '0' && (
                        <span className="text-green-500 ml-2 text-xs">¥{merchant.price}/人</span>
                      )}
                    </div>
                    <div className="text-xs text-gray-600 mb-1">{merchant.tag}</div>
                    {merchant.area && (
                      <div className="text-xs text-gray-500 mb-1">{merchant.area}</div>
                    )}
                    {merchant.visitTime && (
                      <div className="text-xs text-gray-400">
                        {formatTime(merchant.visitTime)}
                      </div>
                    )}
                  </div>
                </div>
                {/* 删除按钮 */}
                <button 
                  onClick={() => handleDeleteFootprint(merchant.id)}
                  className="absolute top-3 right-3 text-gray-400 hover:text-red-500"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
                {/* 加购按钮 */}
                {isInCart(merchant.id) ? (
                  <div className="absolute bottom-3 right-3 flex items-center bg-[#F5F5F5] border border-[#FFF9E6] rounded-lg px-2 py-1">
                    <button 
                      onClick={() => handlePeopleCountChange(merchant.id, getPeopleCount(merchant.id) - 1)}
                      className="text-black font-bold text-lg px-1"
                      disabled={getPeopleCount(merchant.id) < 1}
                    >
                      -
                    </button>
                    <span className="text-black font-medium mx-1 text-sm">{getPeopleCount(merchant.id)}</span>
                    <button 
                      onClick={() => handlePeopleCountChange(merchant.id, getPeopleCount(merchant.id) + 1)}
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
          <div className="flex flex-col items-center justify-center h-64">
            <MapPin className="w-16 h-16 text-gray-400 mb-4" />
            <h2 className="text-xl font-bold text-[#333333] mb-2">暂无足迹</h2>
            <p className="text-[#999999] text-center">
              您还没有浏览任何商家<br />
              快去发现喜欢的商家吧!
            </p>
          </div>
        )}
      </div>

      {/* 清空确认对话框 */}
      {showClearConfirm && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full mx-4">
            <h3 className="text-lg font-bold text-[#333333] mb-4">确定要清空所有足迹吗？</h3>
            <p className="text-sm text-gray-600 mb-4">清空后无法恢复，请谨慎操作。</p>
            <div className="flex justify-end space-x-4">
              <button 
                onClick={cancelClear}
                className="px-4 py-2 text-[#666666] border border-gray-300 rounded-lg"
              >
                取消
              </button>
              <button 
                onClick={confirmClear}
                className="px-4 py-2 bg-red-500 text-white rounded-lg"
              >
                清空
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 底部导航栏 */}
      <BottomNavigation />
    </div>
  );
};

export default Footprint;
