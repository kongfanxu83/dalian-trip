import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Calendar, Share2, MapPin, Users } from 'lucide-react';
import BottomNavigation from '../components/BottomNavigation.jsx';

const DiscoveryHall = () => {
  const navigate = useNavigate();
  const [sharedTrips, setSharedTrips] = useState([]);
  const [favoriteTrips, setFavoriteTrips] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState(null);

  useEffect(() => {
    const savedSharedTrips = JSON.parse(localStorage.getItem('sharedTrips') || '[]');
    
    const exampleTrips = [
      {
        id: 1,
        name: '大连海滨三日游',
        dates: [
          {
            date: '03月15日',
            items: [
              { id: 1, name: '星海广场', peopleCount: 2, image_url: 'https://nocode.meituan.com/photo/search?keyword=星海广场&width=400&height=300' },
              { id: 2, name: '正黄旗海鲜烧烤大排档', peopleCount: 2, image_url: 'https://nocode.meituan.com/photo/search?keyword=正黄旗海鲜烧烤&width=400&height=300' }
            ]
          },
          {
            date: '03月16日',
            items: [
              { id: 3, name: '老虎滩海洋公园', peopleCount: 2, image_url: 'https://nocode.meituan.com/photo/search?keyword=老虎滩海洋公园&width=400&height=300' },
              { id: 4, name: '品海楼·大连海胆锅贴馆', peopleCount: 2, image_url: 'https://nocode.meituan.com/photo/search?keyword=品海楼海胆锅贴&width=400&height=300' }
            ]
          },
          {
            date: '03月17日',
            items: [
              { id: 5, name: '金石滩国家旅游度假区', peopleCount: 2, image_url: 'https://nocode.meituan.com/photo/search?keyword=金石滩&width=400&height=300' },
              { id: 6, name: '大连一方城堡豪华精选酒店', peopleCount: 2, image_url: 'https://nocode.meituan.com/photo/search?keyword=一方城堡酒店&width=400&height=300' }
            ]
          }
        ],
        createdAt: '2026-03-01T08:00:00.000Z'
      },
      {
        id: 2,
        name: '大连美食探索两日游',
        dates: [
          {
            date: '03月20日',
            items: [
              { id: 7, name: '旅大印象·大连名菜馆', peopleCount: 4, image_url: 'https://nocode.meituan.com/photo/search?keyword=旅大印象&width=400&height=300' },
              { id: 8, name: '海味当家·蒸锅海鲜', peopleCount: 4, image_url: 'https://nocode.meituan.com/photo/search?keyword=海味当家蒸海鲜&width=400&height=300' },
              { id: 9, name: '喜鼎海胆水饺', peopleCount: 4, image_url: 'https://nocode.meituan.com/photo/search?keyword=喜鼎海胆水饺&width=400&height=300' }
            ]
          },
          {
            date: '03月21日',
            items: [
              { id: 10, name: '常鲜楼常来尝鲜海胆馆', peopleCount: 4, image_url: 'https://nocode.meituan.com/photo/search?keyword=常鲜楼海胆&width=400&height=300' },
              { id: 11, name: '亚桥咖喱', peopleCount: 4, image_url: 'https://nocode.meituan.com/photo/search?keyword=亚桥咖喱&width=400&height=300' },
              { id: 12, name: '干杯小木屋米酒店', peopleCount: 4, image_url: 'https://nocode.meituan.com/photo/search?keyword=干杯小木屋米酒&width=400&height=300' }
            ]
          }
        ],
        createdAt: '2026-03-05T10:30:00.000Z'
      },
      {
        id: 3,
        name: '大连经典一日游',
        dates: [
          {
            date: '03月25日',
            items: [
              { id: 13, name: '俄罗斯风情街', peopleCount: 3, image_url: 'https://nocode.meituan.com/photo/search?keyword=俄罗斯风情街&width=400&height=300' },
              { id: 14, name: '大连森林动物园', peopleCount: 3, image_url: 'https://nocode.meituan.com/photo/search?keyword=大连森林动物园&width=400&height=300' },
              { id: 15, name: '东方水城', peopleCount: 3, image_url: 'https://nocode.meituan.com/photo/search?keyword=东方水城&width=400&height=300' },
              { id: 16, name: 'UPPER KITCHEN', peopleCount: 3, image_url: 'https://nocode.meituan.com/photo/search?keyword=UPPER+KITCHEN&width=400&height=300' }
            ]
          }
        ],
        createdAt: '2026-03-10T14:15:00.000Z'
      }
    ];
    
    const allTrips = [...savedSharedTrips, ...exampleTrips];
    setSharedTrips(allTrips);
    
    const savedFavorites = JSON.parse(localStorage.getItem('favoriteTrips') || '[]');
    setFavoriteTrips(savedFavorites);
  }, []);

  const handleFavoriteTrip = (tripId) => {
    const isFavorited = favoriteTrips.includes(tripId);
    
    let updatedFavorites;
    if (isFavorited) {
      updatedFavorites = favoriteTrips.filter(id => id !== tripId);
    } else {
      updatedFavorites = [...favoriteTrips, tripId];
    }
    
    setFavoriteTrips(updatedFavorites);
    localStorage.setItem('favoriteTrips', JSON.stringify(updatedFavorites));
  };

  const handleViewDetails = (trip) => {
    setSelectedTrip(trip);
  };

  const handleCloseDetails = () => {
    setSelectedTrip(null);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}月${date.getDate()}日`;
  };

  const getTripDays = (trip) => {
    return trip.dates ? trip.dates.length : 0;
  };

  const getTripMerchantsCount = (trip) => {
    if (!trip.dates) return 0;
    return trip.dates.reduce((total, date) => total + (date.items ? date.items.length : 0), 0);
  };

  const getMaxPeopleCount = (trip) => {
    if (!trip.dates) return 0;
    
    let maxCount = 0;
    trip.dates.forEach(date => {
      if (date.items) {
        date.items.forEach(item => {
          if (item.peopleCount > maxCount) {
            maxCount = item.peopleCount;
          }
        });
      }
    });
    
    return maxCount;
  };

  return (
    <div className="min-h-screen bg-[#F4F4F4] pb-16">
      <div className="fixed top-0 left-0 right-0 h-15 bg-[#FBE451] z-50 px-4 py-2">
        <div className="flex items-center justify-between h-full">
          <div className="w-12"></div>
          <h1 className="text-lg font-bold text-[#333333]">发现大厅</h1>
          <div className="w-12"></div>
        </div>
      </div>

      <div className="pt-20 px-4">
        {sharedTrips.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {sharedTrips.map((trip) => (
              <div 
                key={trip.id} 
                className="bg-white rounded-lg shadow-sm overflow-hidden"
              >
                <div className="h-40 bg-gray-200 relative">
                  {trip.dates && trip.dates.length > 0 && trip.dates[0].items && trip.dates[0].items.length > 0 ? (
                    <img 
                      src={trip.dates[0].items[0].image_url || `https://nocode.meituan.com/photo/search?keyword=${trip.dates[0].items[0].name}&width=400&height=300`}
                      alt={trip.dates[0].items[0].name}
                      className="w-full h-full mx-auto object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                      <span className="text-gray-400">暂无图片</span>
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                    <h3 className="text-white font-bold text-lg">{trip.name}</h3>
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="flex items-center text-sm text-gray-600 mb-2">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>{formatDate(trip.createdAt)}</span>
                    <span className="mx-2">·</span>
                    <span>{getTripDays(trip)}天</span>
                    <span className="mx-2">·</span>
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{getTripMerchantsCount(trip)}个地点</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="w-4 h-4 mr-1" />
                    <span>{getMaxPeopleCount(trip)}人</span>
                  </div>
                  
                  <div className="flex justify-between items-center mt-3">
                    <button 
                      onClick={() => handleFavoriteTrip(trip.id)}
                      className="flex items-center text-sm text-gray-600"
                    >
                      <Heart 
                        className={`w-4 h-4 mr-1 ${
                          favoriteTrips.includes(trip.id) ? 'text-red-500 fill-current' : 'text-gray-400'
                        }`} 
                      />
                      <span>收藏</span>
                    </button>
                    <button 
                      onClick={() => handleViewDetails(trip)}
                      className="px-3 py-1 bg-[#FBE451] text-[#333333] rounded-md text-sm"
                    >
                      查看详情
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64">
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <h2 className="text-xl font-bold text-[#333333] mb-2">暂无分享行程</h2>
            <p className="text-[#999999] text-center">
              还没有用户分享行程<br />
              快去创建并分享您的行程吧!
            </p>
          </div>
        )}
      </div>

      {selectedTrip && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end">
          <div className="bg-white w-full rounded-t-lg max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center px-4 py-3 border-b">
              <h2 className="text-lg font-medium">{selectedTrip.name}</h2>
              <button onClick={handleCloseDetails} className="text-xl">
                <span className="text-gray-500">×</span>
              </button>
            </div>
            
            <div className="p-4">
              {selectedTrip.dates && selectedTrip.dates.map((date, index) => (
                <div key={index} className="mb-6">
                  <h3 className="text-lg font-bold text-[#333333] mb-3">{date.date}</h3>
                  {date.items && date.items.length > 0 ? (
                    <div className="space-y-3">
                      {date.items.map((item, itemIndex) => (
                        <div key={itemIndex} className="flex bg-gray-50 rounded-lg p-3">
                          <div className="w-16 h-16 rounded-lg overflow-hidden mr-3 flex-shrink-0">
                            <img 
                              src={item.image_url || `https://nocode.meituan.com/photo/search?keyword=${item.name}&width=100&height=100`}
                              alt={item.name}
                              className="w-full h-full mx-auto object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-[#333333]">{item.name}</h4>
                            <div className="flex items-center mt-1">
                              <span className="text-sm text-[#666666]">{item.peopleCount || 1}人</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-400">
                      该日期暂无行程安排
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <BottomNavigation />
    </div>
  );
};

export default DiscoveryHall;
