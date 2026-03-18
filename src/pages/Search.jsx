import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Search, Plus, Minus, Star } from 'lucide-react';
import { useCart } from '../hooks/useCart.js';
import BottomNavigation from '../components/BottomNavigation.jsx';
import { useMerchantData } from '../hooks/useMerchantData.js';

const SearchPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false); // 新增状态跟踪是否已执行搜索
  const { addToCart, updatePeopleCount, isInCart, getPeopleCount } = useCart();
  const { useMerchants } = useMerchantData();

  // 获取所有商家数据用于搜索
  const { data: allMerchants = [] } = useMerchants();

  const handleBack = () => {
    navigate('/');
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    
    setIsLoading(true);
    setHasSearched(true); // 标记已执行搜索
    try {
      // 在内存中进行模糊查询
      const results = allMerchants.filter(merchant => 
        merchant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        merchant.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        merchant.area.toLowerCase().includes(searchTerm.toLowerCase()) ||
        merchant.tag.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      setSearchResults(results);
    } catch (error) {
      console.error('搜索失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = (merchant) => {
    addToCart(merchant, 1);
  };

  const handlePeopleCountChange = (merchantId, newCount) => {
    updatePeopleCount(merchantId, newCount);
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
          <h1 className="text-lg font-bold text-[#333333]">搜索</h1>
          <div className="w-12"></div>
        </div>
      </div>

      {/* 搜索框 */}
      <div className="pt-20 px-4 pb-4">
        <div className="flex items-center p-3 bg-white rounded-lg shadow-sm">
          <div className="flex-1 relative">
            <input 
              type="text" 
              placeholder="搜索商家、景点、美食"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-2 px-3 rounded-lg bg-[#F4F4F4] focus:outline-none"
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <button 
            onClick={handleSearch}
            disabled={isLoading}
            className="ml-2 px-4 py-2 bg-[#FBE451] text-[#333333] rounded-lg font-medium"
          >
            {isLoading ? '搜索中...' : '搜索'}
          </button>
        </div>
      </div>

      {/* 搜索结果 */}
      <div className="px-4">
        {searchResults.length > 0 ? (
          <div>
            <h2 className="text-lg font-bold text-[#333333] mb-4">
              搜索结果 ({searchResults.length})
            </h2>
            {searchResults.map((merchant) => (
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
                        <span className="text-green-500 ml-2 text-xs">{merchant.price}</span>
                      )}
                    </div>
                    <div className="text-xs text-gray-600 mb-1">{merchant.tag}</div>
                    {merchant.area && (
                      <div className="text-xs text-gray-500 mb-2">{merchant.area}</div>
                    )}
                  </div>
                </div>
                {/* 加购按钮 */}
                {isInCart(merchant.id) ? (
                  <div className="absolute bottom-3 right-3 flex items-center bg-[#F5F5F5] border border-[#FFF9E6] rounded-lg px-2 py-1">
                    <button 
                      onClick={() => handlePeopleCountChange(merchant.id, getPeopleCount(merchant.id) - 1)}
                      className="text-black font-bold text-lg px-1"
                      disabled={getPeopleCount(merchant.id) < 1}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="text-black font-medium mx-1 text-sm">{getPeopleCount(merchant.id)}</span>
                    <button 
                      onClick={() => handlePeopleCountChange(merchant.id, getPeopleCount(merchant.id) + 1)}
                      className="text-black font-bold text-lg px-1"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => handleAddToCart(merchant)}
                    className="absolute bottom-3 right-3 w-8 h-8 bg-[#FBE451] rounded-full flex items-center justify-center text-[#333333]"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : hasSearched ? ( // 只有在已执行搜索但无结果时才显示"未找到"
          <div className="text-center py-12">
            <p className="text-[#666666]">未找到相关商家</p>
          </div>
        ) : (
          // 未执行搜索时显示默认提示
          <div className="text-center py-12">
            <p className="text-[#666666]">请输入搜索关键词</p>
          </div>
        )}
      </div>

      {/* 底部导航栏 */}
      <BottomNavigation />
    </div>
  );
};

export default SearchPage;
