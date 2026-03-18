import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Search, TrendingUp, Compass, Link } from 'lucide-react';
import BottomNavigation from '../components/BottomNavigation.jsx';

const AddTripPage = () => {
  const navigate = useNavigate();
  const [linkInput, setLinkInput] = useState('');

  const handleBack = () => {
    navigate('/trip-planner');
  };

  const handleRankingClick = () => {
    // 直接跳转到首页（榜单首页）
    navigate('/');
  };

  const handleDiscoveryClick = () => {
    navigate('/discovery-hall');
  };

  const handleLinkSubmit = (e) => {
    e.preventDefault();
    if (linkInput.trim()) {
      // 随机生成一些商家数据
      const randomMerchants = generateRandomMerchants();
      
      // 保存到本地存储
      localStorage.setItem('randomTripData', JSON.stringify(randomMerchants));
      
      // 跳转到行程规划页
      navigate('/trip-planner');
    }
  };

  const generateRandomMerchants = () => {
    const merchantNames = [
      '星海广场', '老虎滩海洋公园', '金石滩', '大连森林动物园',
      '俄罗斯风情街', '东方水城', '大连现代博物馆', '滨海路',
      '大连海鲜大排档', '老边饺子馆', '大连焖子', '香格里拉大酒店'
    ];
    
    const areas = ['中山区', '沙河口区', '甘井子区', '西岗区', '金州区'];
    const tags = ['必游景点', '亲子推荐', '自然风光', '人气推荐', '必吃美食', '地方特色'];
    
    const randomCount = Math.floor(Math.random() * 5) + 3; // 3-7个商家
    const selectedMerchants = [];
    
    for (let i = 0; i < randomCount; i++) {
      const randomName = merchantNames[Math.floor(Math.random() * merchantNames.length)];
      const randomArea = areas[Math.floor(Math.random() * areas.length)];
      const randomTag = tags[Math.floor(Math.random() * tags.length)];
      const randomRating = (Math.random() * 1.5 + 3.5).toFixed(1); // 3.5-5.0
      const randomPrice = Math.floor(Math.random() * 300) + 50; // 50-350
      
      selectedMerchants.push({
        id: Date.now() + i,
        name: randomName,
        area: randomArea,
        tag: randomTag,
        rating: randomRating,
        price: randomPrice.toString(),
        image_url: `https://nocode.meituan.com/photo/search?keyword=${randomName}&width=400&height=300`,
        peopleCount: Math.floor(Math.random() * 4) + 1 // 1-4人
      });
    }
    
    return selectedMerchants;
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
          <h1 className="text-lg font-bold text-[#333333]">添加行程</h1>
          <div className="w-12"></div>
        </div>
      </div>

      <div className="pt-20 px-4">
        {/* 美团2025榜单 */}
        <div className="mb-6">
          <div 
            className="bg-white rounded-lg p-4 shadow-sm cursor-pointer hover:bg-gray-50"
            onClick={handleRankingClick}
          >
            <div className="flex items-center">
              <div className="w-12 h-12 bg-[#FBE451] rounded-lg flex items-center justify-center mr-4">
                <TrendingUp className="w-6 h-6 text-[#333333]" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#333333]">美团2025榜单</h3>
                <p className="text-sm text-[#666666]">查看最新热门榜单</p>
              </div>
            </div>
          </div>
        </div>

        {/* 发现更多行程 */}
        <div className="mb-6">
          <div 
            className="bg-white rounded-lg p-4 shadow-sm cursor-pointer hover:bg-gray-50"
            onClick={handleDiscoveryClick}
          >
            <div className="flex items-center">
              <div className="w-12 h-12 bg-[#FBE451] rounded-lg flex items-center justify-center mr-4">
                <Compass className="w-6 h-6 text-[#333333]" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#333333]">发现更多行程</h3>
                <p className="text-sm text-[#666666]">探索他人分享的精彩行程</p>
              </div>
            </div>
          </div>
        </div>

        {/* 输入链接复制博主同款攻略 */}
        <div className="mb-6">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h3 className="text-lg font-bold text-[#333333] mb-3">复制博主同款攻略</h3>
            <form onSubmit={handleLinkSubmit}>
              <div className="flex items-center">
                <div className="flex-1 relative">
                  <input 
                    type="text" 
                    placeholder="输入链接复制博主同款攻略"
                    value={linkInput}
                    onChange={(e) => setLinkInput(e.target.value)}
                    className="w-full py-3 px-4 rounded-lg bg-[#F4F4F4] focus:outline-none focus:ring-2 focus:ring-[#FBE451]"
                  />
                </div>
                <button 
                  type="submit"
                  className="ml-3 px-4 py-3 bg-[#FBE451] text-[#333333] rounded-lg font-medium"
                >
                  <Link className="w-5 h-5" />
                </button>
              </div>
            </form>
            <p className="text-xs text-[#999999] mt-2">
              输入任意链接，即可生成专属攻略
            </p>
          </div>
        </div>

        {/* 使用说明 */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <h3 className="text-lg font-bold text-[#333333] mb-3">使用说明</h3>
          <div className="space-y-2 text-sm text-[#666666]">
            <p>• 点击"美团2025榜单"查看最新热门商家排行</p>
            <p>• 点击"发现更多行程"探索他人分享的精彩行程</p>
            <p>• 在输入框中输入任意链接，即可生成专属攻略</p>
            <p>• 生成的攻略将包含随机推荐的商家和行程安排</p>
          </div>
        </div>
      </div>

      {/* 底部导航栏 */}
      <BottomNavigation />
    </div>
  );
};

export default AddTripPage;
