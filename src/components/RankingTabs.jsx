import React, { useState } from 'react';
const RankingTabs = ({ onTabChange }) => {
  const [activeTab, setActiveTab] = useState('必吃榜');
  
  const tabs = ['必吃榜', '必玩榜', '必住榜'];

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    // 根据选中的标签传递对应的分类
    let category = '';
    if (tab === '必吃榜') {
      category = '美食';
    } else if (tab === '必玩榜') {
      category = '景点';
    } else if (tab === '必住榜') {
      category = '酒店';
    }
    onTabChange(category);
  };

  return (
    <div className="bg-[#FBE451] px-4 py-2">
      <div className="flex space-x-2 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => handleTabClick(tab)}
            className={`px-4 py-2 rounded-md text-sm font-bold whitespace-nowrap transition-all duration-200 ${
              activeTab === tab
                ? 'bg-white text-[#333333]'
                : 'bg-transparent text-[#333333]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
};

export default RankingTabs;
