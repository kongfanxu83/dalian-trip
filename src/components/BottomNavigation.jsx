import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const BottomNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { name: '榜单', path: '/' },
    { name: '地图', path: '/map' },
    { name: '发现', path: '/discovery-hall' },
    { name: '我的', path: '/profile' },
  ];

  const getActive = () => {
    const p = location.pathname;
    if (p === '/') return '榜单';
    if (p === '/map') return '地图';
    if (p === '/discovery-hall') return '发现';
    if (p === '/profile') return '我的';
    return '';
  };

  const active = getActive();

  return (
    <div className="fixed bottom-0 left-0 right-0 h-14 bg-white border-t border-gray-200 z-50">
      <div className="flex items-center justify-around h-full px-4">
        {navItems.slice(0, 2).map(item => (
          <button
            key={item.name}
            onClick={() => navigate(item.path)}
            className="flex flex-col items-center justify-center flex-1 h-full"
          >
            <span className={`text-base font-bold transition-colors ${active === item.name ? 'text-yellow-400' : 'text-gray-500'}`}>
              {item.name}
            </span>
          </button>
        ))}

        <button
          onClick={() => navigate('/trip-planner')}
          className="bg-yellow-400 text-white w-12 h-12 rounded-full flex items-center justify-center flex-1 -mt-2 shadow-md"
        >
          <span className="text-2xl font-light">+</span>
        </button>

        {navItems.slice(2).map(item => (
          <button
            key={item.name}
            onClick={() => navigate(item.path)}
            className="flex flex-col items-center justify-center flex-1 h-full"
          >
            <span className={`text-base font-bold transition-colors ${active === item.name ? 'text-yellow-400' : 'text-gray-500'}`}>
              {item.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default BottomNavigation;
