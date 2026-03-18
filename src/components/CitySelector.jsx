import React, { useState } from 'react';
import { ChevronLeft, Search } from 'lucide-react';

const CitySelector = ({ onBack }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // 热门城市数据
  const hotCities = ['北京', '上海', '广州', '深圳', '杭州', '成都', '重庆', '西安', '南京', '武汉'];
  
  // 所有城市数据（按字母分组）
  const cityGroups = {
    'A': ['阿坝', '安康', '阿克苏', '阿里'],
    'B': ['北京', '保定', '蚌埠', '包头'],
    'C': ['重庆', '成都', '长沙', '长春'],
    'D': ['大连', '大庆', '东莞', '德阳'],
    'E': ['鄂尔多斯', '恩施', '鄂州'],
    'F': ['福州', '佛山', '抚顺'],
    'G': ['广州', '贵阳', '桂林'],
    'H': ['杭州', '合肥', '哈尔滨', '惠州'],
    'J': ['济南', '嘉兴', '金华'],
    'K': ['昆明', '开封'],
    'L': ['洛阳', '兰州', '柳州'],
    'M': ['绵阳', '马鞍山'],
    'N': ['南京', '宁波', '南昌', '南宁'],
    'P': ['攀枝花', '平顶山'],
    'Q': ['青岛', '泉州', '秦皇岛'],
    'S': ['上海', '深圳', '苏州', '沈阳'],
    'T': ['天津', '太原', '台州'],
    'W': ['武汉', '无锡', '温州'],
    'X': ['西安', '厦门', '徐州'],
    'Y': ['扬州', '烟台', '银川'],
    'Z': ['郑州', '珠海', '淄博']
  };

  // 过滤城市
  const filteredCities = Object.keys(cityGroups).reduce((acc, letter) => {
    const filtered = cityGroups[letter].filter(city => 
      city.includes(searchTerm)
    );
    if (filtered.length > 0) {
      acc[letter] = filtered;
    }
    return acc;
  }, {});

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      {/* 顶部导航 */}
      <div className="flex items-center justify-between p-4 border-b">
        <button onClick={onBack} className="flex items-center text-[#333333]">
          <ChevronLeft className="w-5 h-5" />
          <span className="ml-1">返回</span>
        </button>
        <h1 className="text-lg font-bold text-[#333333]">选择城市</h1>
        <div className="w-12"></div>
      </div>

      {/* 搜索框 */}
      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#999999] w-4 h-4" />
          <input
            type="text"
            placeholder="搜索城市"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FBE451]"
          />
        </div>
      </div>

      {/* 热门城市 */}
      {!searchTerm && (
        <div className="p-4 border-b">
          <h2 className="text-sm text-[#999999] mb-3">热门城市</h2>
          <div className="flex flex-wrap gap-2">
            {hotCities.map((city) => (
              <button
                key={city}
                className="px-3 py-1 bg-[#FFF9C4] text-[#333333] rounded-full text-sm"
                onClick={() => {
                  // 这里可以添加选择城市的逻辑
                  alert(`已选择城市: ${city}`);
                  onBack();
                }}
              >
                {city}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 城市列表 */}
      <div className="flex-1 overflow-y-auto">
        {Object.keys(searchTerm ? filteredCities : cityGroups).map((letter) => (
          <div key={letter} className="border-b">
            <div className="sticky top-0 bg-[#FFF9C4] px-4 py-2 text-sm font-bold text-[#FBE451]">
              {letter}
            </div>
            <div className="grid grid-cols-3 gap-1 p-4">
              {(searchTerm ? filteredCities[letter] : cityGroups[letter]).map((city) => (
                <button
                  key={city}
                  className="py-2 text-center text-[#333333] hover:bg-[#FFF9C4] rounded"
                  onClick={() => {
                    // 这里可以添加选择城市的逻辑
                    alert(`已选择城市: ${city}`);
                    onBack();
                  }}
                >
                  {city}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CitySelector;
