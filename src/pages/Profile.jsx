import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, User, Heart, MapPin, Calendar, Settings } from 'lucide-react';
import BottomNavigation from '../components/BottomNavigation.jsx';

const Profile = () => {
  const navigate = useNavigate();
  const [isLoggedIn] = useState(true); // 默认已登录
  
  // 用户信息
  const user = {
    name: '用户昵称',
    avatar: 'https://nocode.meituan.com/photo/search?keyword=user,avatar&width=100&height=100',
    level: '黄金会员'
  };

  // 菜单项数据
  const menuItems = [
    { icon: <Heart className="w-5 h-5" />, title: '我的收藏', path: '/favorites' },
    { icon: <MapPin className="w-5 h-5" />, title: '我的足迹', path: '/footprint' },
    { icon: <Calendar className="w-5 h-5" />, title: '我的行程', path: '/my-trips' },
    { icon: <Settings className="w-5 h-5" />, title: '设置', path: '/settings' }
  ];

  return (
    <div className="min-h-screen bg-[#F4F4F4] pb-16">
      {/* 顶部导航栏 */}
      <div className="fixed top-0 left-0 right-0 h-15 bg-[#FBE451] z-50 px-4 py-2">
        <div className="flex items-center justify-between h-full">
          <div className="w-12"></div>
          <h1 className="text-lg font-bold text-[#333333]">我的</h1>
          <div className="w-12"></div>
        </div>
      </div>

      {/* 主要内容区域 */}
      <div className="pt-20 px-4">
        {/* 用户信息卡片 */}
        <div className="bg-white rounded-lg p-4 mb-4 shadow-sm">
          <div className="flex items-center">
            <div className="w-16 h-16 rounded-full overflow-hidden mr-4">
              <img 
                src={user.avatar} 
                alt="用户头像" 
                className="w-full h-full mx-auto object-cover"
              />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-bold text-[#333333]">{user.name}</h2>
              <p className="text-sm text-[#666666]">{user.level}</p>
            </div>
            <ChevronRight className="w-5 h-5 text-[#999999]" />
          </div>
        </div>

        {/* 菜单列表 */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {menuItems.map((item, index) => (
            <div 
              key={index}
              className={`flex items-center justify-between px-4 py-4 ${
                index !== menuItems.length - 1 ? 'border-b border-gray-100' : ''
              }`}
              onClick={() => navigate(item.path)}
            >
              <div className="flex items-center">
                <div className="text-[#FBE451] mr-3">
                  {item.icon}
                </div>
                <span className="text-[#333333] font-medium">{item.title}</span>
              </div>
              <ChevronRight className="w-5 h-5 text-[#999999]" />
            </div>
          ))}
        </div>
      </div>

      {/* 底部导航栏 */}
      <BottomNavigation />
    </div>
  );
};

export default Profile;
