import React from 'react';
import MerchantCard from './MerchantCard.jsx';

const MerchantList = ({ category, onAddClick, onPeopleCountChange, isMerchantInCart, getCartPeopleCount, onFavoriteClick, isMerchantFavorited }) => {
  // 根据分类获取不同的商家数据
  const getMerchantsByCategory = (category) => {
    const merchantsData = {
      '美食': [
        {
          id: 1,
          name: '大连海鲜大排档',
          tag: '人气推荐',
          rating: '4.8',
          price: '89',
          area: '中山区',
          favoriteCount: '3241'
        },
        {
          id: 2,
          name: '老边饺子馆',
          tag: '必吃美食',
          rating: '4.9',
          price: '65',
          area: '甘井子区',
          favoriteCount: '4521'
        },
        {
          id: 3,
          name: '大连焖子',
          tag: '地方特色',
          rating: '4.7',
          price: '25',
          area: '高新区',
          favoriteCount: '2876'
        }
      ],
      '景点': [
        {
          id: 4,
          name: '星海广场',
          tag: '必游景点',
          rating: '4.7',
          price: '0',
          area: '沙河口区',
          favoriteCount: '8967'
        },
        {
          id: 5,
          name: '老虎滩海洋公园',
          tag: '亲子推荐',
          rating: '4.8',
          price: '198',
          area: '中山区',
          favoriteCount: '6543'
        },
        {
          id: 6,
          name: '金石滩',
          tag: '自然风光',
          rating: '4.9',
          price: '280',
          area: '金州区',
          favoriteCount: '5432'
        }
      ],
      '酒店': [
        {
          id: 7,
          name: '香格里拉大酒店',
          tag: '豪华住宿',
          rating: '4.9',
          price: '688',
          area: '中山区',
          favoriteCount: '2156'
        },
        {
          id: 8,
          name: '大连富丽华大酒店',
          tag: '商务首选',
          rating: '4.8',
          price: '588',
          area: '西岗区',
          favoriteCount: '1876'
        },
        {
          id: 9,
          name: '海景酒店',
          tag: '海景房',
          rating: '4.7',
          price: '488',
          area: '甘井子区',
          favoriteCount: '1543'
        }
      ]
    };

    return merchantsData[category] || merchantsData['美食'];
  };

  const merchants = getMerchantsByCategory(category);

  return (
    <div className="flex-1 overflow-y-auto pb-16 px-4">
      {merchants.map((merchant) => (
        <MerchantCard 
          key={merchant.id}
          merchant={merchant}
          onAddClick={onAddClick}
          onPeopleCountChange={onPeopleCountChange}
          isInCart={isMerchantInCart(merchant.id)}
          cartPeopleCount={getCartPeopleCount(merchant.id)}
          onFavoriteClick={onFavoriteClick}
          isFavorited={isMerchantFavorited(merchant.id)}
        />
      ))}
    </div>
  );
};

export default MerchantList;
