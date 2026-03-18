import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const useCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  // 从本地存储加载购物车数据
  useEffect(() => {
    const savedCart = localStorage.getItem('cartItems');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  // 保存购物车数据到本地存储
  const saveCartToStorage = (items) => {
    localStorage.setItem('cartItems', JSON.stringify(items));
  };

  // 添加商品到购物车
  const addToCart = (merchant, peopleCount = 1) => {
    const existingItemIndex = cartItems.findIndex(item => item.id === merchant.id);
    
    let updatedCart;
    if (existingItemIndex >= 0) {
      updatedCart = [...cartItems];
      updatedCart[existingItemIndex].peopleCount = peopleCount;
    } else {
      updatedCart = [...cartItems, { ...merchant, peopleCount }];
    }
    
    setCartItems(updatedCart);
    saveCartToStorage(updatedCart);
  };

  // 更新购物车中商品的人数
  const updatePeopleCount = (merchantId, newCount) => {
    if (newCount <= 0) {
      const updatedItems = cartItems.filter(item => item.id !== merchantId);
      setCartItems(updatedItems);
      saveCartToStorage(updatedItems);
    } else {
      const updatedItems = cartItems.map(item => 
        item.id === merchantId 
          ? { ...item, peopleCount: newCount } 
          : item
      );
      setCartItems(updatedItems);
      saveCartToStorage(updatedItems);
    }
  };

  // 从购物车中移除商品
  const removeFromCart = (merchantId) => {
    const updatedItems = cartItems.filter(item => item.id !== merchantId);
    setCartItems(updatedItems);
    saveCartToStorage(updatedItems);
  };

  // 清空购物车
  const clearCart = () => {
    setCartItems([]);
    saveCartToStorage([]);
  };

  // 计算购物车总价 - 修复价格解析逻辑
  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      // 解析价格字符串，提取最低价格
      let itemPrice = 0;
      
      if (item.price) {
        // 处理价格格式如 "￥80-150" 或 "￥120-200"
        if (typeof item.price === 'string' && item.price.includes('-')) {
          const priceMatch = item.price.match(/￥(\d+)-(\d+)/);
          if (priceMatch) {
            itemPrice = parseFloat(priceMatch[1]); // 取第一个价格（最低价）
          }
        } 
        // 处理价格格式如 "￥150" 或 "￥298/位"
        else if (typeof item.price === 'string') {
          const priceMatch = item.price.match(/￥(\d+)/);
          if (priceMatch) {
            itemPrice = parseFloat(priceMatch[1]);
          }
        }
        // 处理数字类型的价格
        else if (typeof item.price === 'number') {
          itemPrice = item.price;
        }
      }
      
      return total + itemPrice * item.peopleCount;
    }, 0);
  };

  // 检查商品是否在购物车中
  const isInCart = (merchantId) => {
    return cartItems.some(item => item.id === merchantId);
  };

  // 获取购物车中商品的人数
  const getPeopleCount = (merchantId) => {
    const item = cartItems.find(item => item.id === merchantId);
    return item ? item.peopleCount : 1;
  };

  // 完成购物车操作，跳转到行程规划页面
  const completeCart = () => {
    navigate('/trip-planner');
  };

  // 设置购物车数据（用于随机生成数据）
  const setCartItemsDirectly = (items) => {
    setCartItems(items);
    saveCartToStorage(items);
  };

  return {
    cartItems,
    addToCart,
    updatePeopleCount,
    removeFromCart,
    clearCart,
    getCartTotal,
    isInCart,
    getPeopleCount,
    completeCart,
    setCartItemsDirectly
  };
};
