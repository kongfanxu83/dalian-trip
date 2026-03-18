import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Bell, Lock, Globe, HelpCircle, Info } from 'lucide-react';
import BottomNavigation from '../components/BottomNavigation.jsx';

const Settings = () => {
  const navigate = useNavigate();
  
  const handleBack = () => {
    navigate('/profile');
  };

  // 设置菜单项数据
  const settingsItems = [
    { icon: <Bell className="w-5 h-5" />, title: '通知设置', description: '管理推送通知' },
    { icon: <Lock className="w-5 h-5" />, title: '隐私设置', description: '控制个人信息可见性' },
    { icon: <Globe className="w-5 h-5" />, title: '语言设置', description: '选择应用语言' },
    { icon: <HelpCircle className="w-5 h-5" />, title: '帮助与反馈', description: '获取帮助或提交反馈' },
    { icon: <Info className="w-5 h-5" />, title: '关于我们', description: '查看应用信息' }
  ];

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
          <h1 className="text-lg font-bold text-[#333333]">设置</h1>
          <div className="w-12"></div>
        </div>
      </div>

      {/* 主要内容区域 */}
      <div className="pt-20 px-4">
        {/* 设置列表 */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {settingsItems.map((item, index) => (
            <div 
              key={index}
              className={`flex items-center px-4 py-4 ${
                index !== settingsItems.length - 1 ? 'border-b border-gray-100' : ''
              }`}
              onClick={() => {
                // 这里可以添加跳转到具体设置页面的逻辑
                console.log(`点击了${item.title}`);
              }}
            >
              <div className="text-[#FBE451] mr-3">
                {item.icon}
              </div>
              <div className="flex-1">
                <div className="text-[#333333] font-medium">{item.title}</div>
                <div className="text-[#999999] text-sm mt-1">{item.description}</div>
              </div>
              <ChevronLeft className="w-5 h-5 text-[#999999] transform rotate-180" />
            </div>
          ))}
        </div>

        {/* 版本信息 */}
        <div className="mt-6 text-center">
          <p className="text-[#999999] text-sm">版本 1.0.0</p>
        </div>
      </div>

      {/* 底部导航栏 */}
      <BottomNavigation />
    </div>
  );
};

export default Settings;
