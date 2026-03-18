import { useMerchantData } from '../hooks/useMerchantData';
import DatabaseMerchantCard from '../components/DatabaseMerchantCard';
import BottomNavigation from '../components/BottomNavigation';
import { useCart } from '../hooks/useCart';
import { Search, Filter, TrendingUp, Database } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePopulateDatabase } from '../hooks/usePopulateDatabase';

const RankingPage = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('美食');
  const [searchTerm, setSearchTerm] = useState('');
  const [favoriteItems, setFavoriteItems] = useState([]);
  
  const { useRankingList, useSyncFromAmap } = useMerchantData();
  const { addToCart, updatePeopleCount, isInCart, getPeopleCount } = useCart();
  const populateMutation = usePopulateDatabase();
  
  const { data: merchants = [], isLoading, error } = useRankingList(activeCategory);
  const syncMutation = useSyncFromAmap();

  // 从本地存储加载收藏数据
  React.useEffect(() => {
    const savedFavorites = localStorage.getItem('favoriteItems');
    if (savedFavorites) {
      setFavoriteItems(JSON.parse(savedFavorites));
    }
  }, []);

  const categories = ['美食', '景点', '酒店', '购物', '娱乐', '生活服务'];

  const handleAddClick = (merchant, peopleCount) => {
    addToCart(merchant, peopleCount);
  };

  const handlePeopleCountChange = (merchantId, newCount) => {
    updatePeopleCount(merchantId, newCount);
  };

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

  const isMerchantFavorited = (merchantId) => {
    return favoriteItems.some(item => item.id === merchantId);
  };

  const handleSyncFromAmap = async () => {
    try {
      await syncMutation.mutateAsync({
        keywords: activeCategory,
        city: '大连',
        category: activeCategory
      });
      alert('数据同步成功！');
    } catch (error) {
      alert('数据同步失败：' + error.message);
    }
  };

  const handlePopulateDatabase = async () => {
    try {
      await populateMutation.mutateAsync();
      alert('数据库填充成功！');
    } catch (error) {
      alert('数据库填充失败：' + error.message);
    }
  };

  const filteredMerchants = merchants.filter(merchant =>
    merchant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    merchant.tag.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F4F4F4] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FBE451] mx-auto mb-4"></div>
          <p className="text-[#666666]">加载中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F4F4F4] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">加载失败</p>
          <div className="flex flex-col space-y-2">
            <button 
              onClick={handleSyncFromAmap}
              disabled={syncMutation.isPending}
              className="px-4 py-2 bg-[#FBE451] text-[#333333] rounded-lg"
            >
              {syncMutation.isPending ? '同步中...' : '从高德地图同步数据'}
            </button>
            <button 
              onClick={handlePopulateDatabase}
              disabled={populateMutation.isPending}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg"
            >
              {populateMutation.isPending ? '填充中...' : '填充数据库(100+数据)'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F4F4] pb-16">
      {/* 顶部导航栏 */}
      <div className="fixed top-0 left-0 right-0 h-15 bg-[#FBE451] z-50 px-4 py-2">
        <div className="flex items-center justify-between h-full">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center text-[#333333] font-bold"
          >
            <span className="mr-1">←</span>
            <span>返回</span>
          </button>
          <h1 className="text-lg font-bold text-[#333333]">榜单</h1>
          <div className="flex space-x-2">
            <button 
              onClick={handleSyncFromAmap}
              disabled={syncMutation.isPending}
              className="text-[#333333] text-sm"
            >
              {syncMutation.isPending ? '同步中...' : '同步'}
            </button>
            <button 
              onClick={handlePopulateDatabase}
              disabled={populateMutation.isPending}
              className="text-[#333333] text-sm"
            >
              <Database className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 搜索栏 */}
      <div className="pt-20 px-4 pb-4">
        <div className="flex items-center p-3 bg-white rounded-lg shadow-sm">
          <div className="flex-1 relative">
            <input 
              type="text" 
              placeholder="搜索商家"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-2 px-3 rounded-lg bg-[#F4F4F4] focus:outline-none"
            />
          </div>
          <button className="ml-2 px-4 py-2 bg-[#FBE451] text-[#333333] rounded-lg font-medium">
            <Search className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 分类标签 */}
      <div className="px-4 pb-4">
        <div className="flex space-x-2 overflow-x-auto">
          {categories.map((category) => (
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

      {/* 榜单标题 */}
      <div className="px-4 pb-4">
        <div className="flex items-center">
          <TrendingUp className="w-5 h-5 text-[#FBE451] mr-2" />
          <h2 className="text-lg font-bold text-[#333333]">{activeCategory}榜单</h2>
          <span className="ml-2 text-sm text-[#666666]">
            共{filteredMerchants.length}家
          </span>
        </div>
      </div>

      {/* 商家列表 */}
      <div className="px-4">
        {filteredMerchants.length > 0 ? (
          filteredMerchants.map((merchant, index) => (
            <div key={merchant.id} className="relative">
              {/* 排名标识 */}
              <div className="absolute -left-2 top-4 z-10">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  index < 3 
                    ? 'bg-[#FBE451] text-[#333333]' 
                    : 'bg-gray-300 text-gray-600'
                }`}>
                  {index + 1}
                </div>
              </div>
              
              <DatabaseMerchantCard 
                merchant={merchant}
                onAddClick={handleAddClick}
                onPeopleCountChange={handlePeopleCountChange}
                isInCart={isInCart(merchant.id)}
                cartPeopleCount={getPeopleCount(merchant.id)}
                onFavoriteClick={handleFavoriteClick}
                isFavorited={isMerchantFavorited(merchant.id)}
              />
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-[#666666] mb-4">暂无{activeCategory}榜单数据</p>
            <div className="flex flex-col space-y-2">
              <button 
                onClick={handleSyncFromAmap}
                className="px-4 py-2 bg-[#FBE451] text-[#333333] rounded-lg"
              >
                从高德地图获取数据
              </button>
              <button 
                onClick={handlePopulateDatabase}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg"
              >
                填充数据库(100+数据)
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 底部导航栏 */}
      <BottomNavigation />
    </div>
  );
};

export default RankingPage;
