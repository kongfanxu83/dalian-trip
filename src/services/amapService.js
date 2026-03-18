// 高德地图API服务
const AMAP_API_KEY = '7a92ffeb1e82f80519ca060a2b935524';
const AMAP_SECURITY_KEY = '2b38f637e0a3a3ecc672233f52f2dfb6';
const AMAP_BASE_URL = 'https://restapi.amap.com/v3';

class AmapService {
  constructor() {
    this.apiKey = AMAP_API_KEY;
    this.securityKey = AMAP_SECURITY_KEY;
  }

  // 搜索POI（兴趣点）
  async searchPOI(keywords, city = '大连', type = '') {
    try {
      const params = new URLSearchParams({
        key: this.apiKey,
        keywords: keywords,
        city: city,
        citylimit: true,
        output: 'json',
        offset: 20,
        page: 1,
        extensions: 'all'
      });

      if (type) {
        params.append('type', type);
      }

      const response = await fetch(`${AMAP_BASE_URL}/place/text?${params}`);
      const data = await response.json();

      if (data.status === '1' && data.pois) {
        return data.pois.map(poi => this.transformPOIToMerchant(poi));
      }
      
      return [];
    } catch (error) {
      console.error('高德地图搜索失败:', error);
      return [];
    }
  }

  // 根据位置搜索周边POI
  async searchNearby(latitude, longitude, keywords = '', radius = 1000) {
    try {
      const params = new URLSearchParams({
        key: this.apiKey,
        location: `${longitude},${latitude}`,
        keywords: keywords,
        radius: radius,
        output: 'json',
        offset: 20,
        page: 1,
        extensions: 'all'
      });

      const response = await fetch(`${AMAP_BASE_URL}/place/around?${params}`);
      const data = await response.json();

      if (data.status === '1' && data.pois) {
        return data.pois.map(poi => this.transformPOIToMerchant(poi));
      }
      
      return [];
    } catch (error) {
      console.error('高德地图周边搜索失败:', error);
      return [];
    }
  }

  // 地理编码（地址转坐标）
  async geocode(address) {
    try {
      const params = new URLSearchParams({
        key: this.apiKey,
        address: address,
        output: 'json'
      });

      const response = await fetch(`${AMAP_BASE_URL}/geocode/geo?${params}`);
      const data = await response.json();

      if (data.status === '1' && data.geocodes.length > 0) {
        const geocode = data.geocodes[0];
        const [longitude, latitude] = geocode.location.split(',');
        return {
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
          formatted_address: geocode.formatted_address
        };
      }
      
      return null;
    } catch (error) {
      console.error('地理编码失败:', error);
      return null;
    }
  }

  // 将高德POI数据转换为商家数据格式
  transformPOIToMerchant(poi) {
    const [longitude, latitude] = poi.location.split(',');
    
    return {
      id: poi.id || Date.now(),
      name: poi.name,
      category: this.getCategoryFromType(poi.typecode || poi.type),
      rating: this.parseRating(poi.biz_ext?.rating || '0'),
      price: this.parsePrice(poi.biz_ext?.cost || '0'),
      area: poi.pname || '',
      tag: poi.type || '',
      address: poi.address || '',
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      phone: poi.tel || '',
      business_hours: poi.opening_hours || '',
      description: poi.business_area || '',
      image_url: this.generateImageUrl(poi.name),
      amap_id: poi.id,
      favorite_count: Math.floor(Math.random() * 1000) + 100,
      is_featured: Math.random() > 0.7,
      ranking_score: this.calculateRankingScore(poi)
    };
  }

  // 根据类型代码获取分类
  getCategoryFromType(typeCode) {
    const categoryMap = {
      '050000': '美食',
      '060000': '购物',
      '070000': '生活服务',
      '080000': '娱乐',
      '090000': '景点',
      '100000': '酒店',
      '110000': '医疗',
      '120000': '教育',
      '130000': '金融',
      '140000': '汽车',
      '150000': '房产',
      '160000': '公司',
      '170000': '政府机构'
    };
    
    // 如果传入的是字符串类型代码，尝试匹配
    if (typeof typeCode === 'string') {
      // 提取前6位作为主要分类代码
      const mainType = typeCode.substring(0, 6);
      return categoryMap[mainType] || '其他';
    }
    
    return '其他';
  }

  // 解析评分
  parseRating(rating) {
    const numRating = parseFloat(rating);
    return isNaN(numRating) ? 4.5 : Math.min(5.0, Math.max(1.0, numRating));
  }

  // 解析价格
  parsePrice(cost) {
    const numCost = parseFloat(cost);
    return isNaN(numCost) ? 0 : numCost;
  }

  // 生成图片URL
  generateImageUrl(name) {
    return `https://nocode.meituan.com/photo/search?keyword=${encodeURIComponent(name)}&width=400&height=300`;
  }

  // 计算排名分数
  calculateRankingScore(poi) {
    let score = 0;
    const rating = parseFloat(poi.biz_ext?.rating || '0');
    score += rating * 20; // 评分权重
    
    // 根据类型给予不同权重
    if (poi.type?.includes('05')) score += 30; // 美食
    if (poi.type?.includes('09')) score += 25; // 景点
    if (poi.type?.includes('10')) score += 20; // 酒店
    
    return Math.floor(score);
  }

  // 批量获取大连各类POI数据
  async getAllDalianPOIs() {
    const categories = [
      { name: '美食', keywords: '餐厅,饭店,小吃', type: '050000' },
      { name: '景点', keywords: '景点,公园,博物馆', type: '090000' },
      { name: '酒店', keywords: '酒店,宾馆,住宿', type: '100000' },
      { name: '购物', keywords: '商场,超市,购物中心', type: '060000' },
      { name: '娱乐', keywords: '电影院,KTV,游乐场', type: '080000' }
    ];

    let allResults = [];
    
    for (const category of categories) {
      try {
        const results = await this.searchPOI(category.keywords, '大连', category.type);
        allResults = allResults.concat(results);
        
        // 添加延迟避免请求过快
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.error(`获取${category.name}数据失败:`, error);
      }
    }
    
    return allResults;
  }
}

export default new AmapService();
