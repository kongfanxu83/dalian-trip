import React from 'react';
import { X } from 'lucide-react';

const MapInstructions = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-bold">地图使用说明</h2>
          <button onClick={onClose} className="text-gray-500">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-4">
          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-[#FBE451] mb-2">1. 地图功能</h3>
              <p className="text-sm text-gray-600">
                • 显示大连市的地图<br/>
                • 支持缩放和拖动<br/>
                • 显示商家位置标记
              </p>
            </div>
            
            <div>
              <h3 className="font-bold text-[#FBE451] mb-2">2. 分类筛选</h3>
              <p className="text-sm text-gray-600">
                • 点击"景点"、"美食"、"酒店"等分类按钮<br/>
                • 地图会自动显示对应分类的商家<br/>
                • 标记点会显示在地图上
              </p>
            </div>
            
            <div>
              <h3 className="font-bold text-[#FBE451] mb-2">3. 搜索功能</h3>
              <p className="text-sm text-gray-600">
                • 在搜索框输入关键词<br/>
                • 点击搜索按钮或按回车键<br/>
                • 地图会显示搜索结果
              </p>
            </div>
            
            <div>
              <h3 className="font-bold text-[#FBE451] mb-2">4. 商家详情</h3>
              <p className="text-sm text-gray-600">
                • 点击地图上的标记点<br/>
                • 或点击商家列表中的商家<br/>
                • 查看详细信息和评价
              </p>
            </div>
            
            <div>
              <h3 className="font-bold text-[#FBE451] mb-2">5. 数据同步</h3>
              <p className="text-sm text-gray-600">
                • 在榜单页面点击"同步"按钮<br/>
                • 从高德地图获取最新数据<br/>
                • 点击"填充数据库"获取100+条数据
              </p>
            </div>
          </div>
        </div>
        
        <div className="p-4 border-t">
          <button 
            onClick={onClose}
            className="w-full py-2 bg-[#FBE451] text-[#333333] rounded-lg font-medium"
          >
            我知道了
          </button>
        </div>
      </div>
    </div>
  );
};

export default MapInstructions;
