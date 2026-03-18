import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Calendar, Edit, Share2, MapPin, Users, ChevronLeft } from 'lucide-react';
import BottomNavigation from '../components/BottomNavigation.jsx';

const MyTrips = () => {
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [tripToDelete, setTripToDelete] = useState(null);

  useEffect(() => {
    const savedTrips = JSON.parse(localStorage.getItem('myTrips') || '[]');
    setTrips(savedTrips);
  }, []);

  const handleBack = () => {
    navigate('/profile');
  };

  const handleTripClick = (trip) => {
    setSelectedTrip(trip);
  };

  const handleCloseDetail = () => {
    setSelectedTrip(null);
  };

  const handleEditTrip = (trip) => {
    // 将行程数据保存到本地存储，以便行程规划页面读取
    localStorage.setItem('editingTrip', JSON.stringify(trip));
    // 跳转到行程规划页面
    navigate('/trip-planner');
  };

  const handleDeleteClick = (trip, e) => {
    e.stopPropagation();
    setTripToDelete(trip);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (tripToDelete) {
      const updatedTrips = trips.filter(trip => trip.id !== tripToDelete.id);
      setTrips(updatedTrips);
      localStorage.setItem('myTrips', JSON.stringify(updatedTrips));
      
      if (selectedTrip && selectedTrip.id === tripToDelete.id) {
        setSelectedTrip(null);
      }
    }
    setShowDeleteConfirm(false);
    setTripToDelete(null);
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setTripToDelete(null);
  };

  const handleShareTrip = (trip) => {
    const existingSharedTrips = JSON.parse(localStorage.getItem('sharedTrips') || '[]');
    
    const isAlreadyShared = existingSharedTrips.some(sharedTrip => sharedTrip.id === trip.id);
    
    if (!isAlreadyShared) {
      const sharedTrip = {
        ...trip,
        sharedAt: new Date().toISOString()
      };
      
      const updatedSharedTrips = [...existingSharedTrips, sharedTrip];
      localStorage.setItem('sharedTrips', JSON.stringify(updatedSharedTrips));
      
      alert('行程已分享至发现大厅！');
    } else {
      alert('此行程已经分享过了！');
    }
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
          <button 
            onClick={handleBack}
            className="flex items-center text-[#333333] font-bold"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="ml-1">返回</span>
          </button>
          <h1 className="text-lg font-bold text-[#333333]">我的行程</h1>
          <div className="w-12"></div>
        </div>
      </div>

      <div className="pt-20 px-4">
        {trips.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {trips.map((trip) => (
              <div 
                key={trip.id} 
                className="bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer"
                onClick={() => handleTripClick(trip)}
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
                    <div className="flex space-x-2">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditTrip(trip);
                        }}
                        className="flex items-center px-3 py-1 bg-blue-500 text-white rounded-md text-sm"
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        修改
                      </button>
                      <button 
                        onClick={(e) => handleDeleteClick(trip, e)}
                        className="flex items-center px-3 py-1 bg-red-500 text-white rounded-md text-sm"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        删除
                      </button>
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleShareTrip(trip);
                      }}
                      className="flex items-center px-3 py-1 bg-green-500 text-white rounded-md text-sm"
                    >
                      <Share2 className="w-4 h-4 mr-1" />
                      分享
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64">
            <div className="text-gray-400 text-6xl mb-4">📅</div>
            <h2 className="text-xl font-bold text-[#333333] mb-2">暂无行程</h2>
            <p className="text-[#999999] text-center">
              您还没有保存任何行程<br />
              快去创建您的第一个行程吧!
            </p>
          </div>
        )}
      </div>

      {selectedTrip && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end">
          <div className="bg-white w-full rounded-t-lg max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center px-4 py-3 border-b">
              <h2 className="text-lg font-medium">{selectedTrip.name}</h2>
              <button onClick={handleCloseDetail} className="text-xl">
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
                              {item.price && (
                                <span className="text-sm text-green-500 ml-2">¥{item.price}/人</span>
                              )}
                            </div>
                            {item.area && (
                              <div className="text-xs text-gray-500 mt-1">{item.area}</div>
                            )}
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

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full mx-4">
            <h3 className="text-lg font-bold text-[#333333] mb-4">确定要删除此行程吗？</h3>
            <p className="text-sm text-gray-600 mb-4">删除后无法恢复，请谨慎操作。</p>
            <div className="flex justify-end space-x-4">
              <button 
                onClick={cancelDelete}
                className="px-4 py-2 text-[#666666] border border-gray-300 rounded-lg"
              >
                取消
              </button>
              <button 
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-lg"
              >
                删除
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomNavigation />
    </div>
  );
};

export default MyTrips;
