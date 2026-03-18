import React from 'react';
const FilterBar = () => {
  const filters = ['全城 ▼', '全部分类 ▼', '综合排序 ▼'];

  return (
    <div className="bg-[#F4F4F4] px-4 py-2 border-t border-b border-gray-200">
      {/* 筛选条件 */}
      <div className="flex items-center justify-between">
        <div className="text-[#FBE451] font-bold border-b-2 border-[#FBE451] pb-1">
          热度
        </div>
        <div className="flex items-center space-x-4">
          <button className="text-[#666666] text-xs flex items-center">
            全城 <span className="ml-1">▼</span>
          </button>
          <button className="text-[#666666] text-xs flex items-center">
            全部分类 <span className="ml-1">▼</span>
          </button>
          <select className="bg-white rounded-md px-2 py-1 text-xs text-[#666666]">
            <option>综合排序 ▼</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
