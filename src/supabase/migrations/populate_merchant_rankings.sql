-- 填充商家榜单数据表
-- 此文件用于填充初始数据，实际数据将通过高德地图API获取

-- 创建函数来生成随机评分
CREATE OR REPLACE FUNCTION random_rating()
RETURNS DECIMAL(3,1) AS $$
BEGIN
  RETURN ROUND((RANDOM() * 2 + 3)::NUMERIC, 1);
END;
$$ LANGUAGE plpgsql;

-- 创建函数来生成随机价格
CREATE OR REPLACE FUNCTION random_price(base_price DECIMAL)
RETURNS DECIMAL(10,2) AS $$
BEGIN
  RETURN ROUND((base_price + RANDOM() * base_price / 2)::NUMERIC, 2);
END;
$$ LANGUAGE plpgsql;

-- 创建函数来生成随机排名分数
CREATE OR REPLACE FUNCTION random_ranking_score()
RETURNS INTEGER AS $$
BEGIN
  RETURN FLOOR(RANDOM() * 100 + 50);
END;
$$ LANGUAGE plpgsql;

-- 插入美食类商家数据
INSERT INTO merchant_rankings (
  name, category, rating, price, area, tag, address, latitude, longitude, 
  phone, business_hours, description, image_url, amap_id, favorite_count, 
  is_featured, ranking_score
) VALUES 
('大连海鲜大排档', '美食', random_rating(), random_price(80), '中山区', '人气推荐', '大连市中山区人民路1号', 38.91459, 121.618622, '0411-88888888', '10:00-22:00', '大连特色海鲜餐厅，以新鲜海产品为主打，招牌菜有蒜蓉扇贝、清蒸海参等', 'https://nocode.meituan.com/photo/search?keyword=大连海鲜大排档&width=400&height=300', 'B000A8URXR', FLOOR(RANDOM() * 1000) + 100, TRUE, random_ranking_score()),
('老边饺子馆', '美食', random_rating(), random_price(60), '甘井子区', '必吃美食', '大连市甘井子区华东路1号', 38.973094, 121.583333, '0411-87654321', '09:00-21:00', '百年老店，正宗东北饺子，招牌三鲜饺子和酸菜肉饺子深受食客喜爱', 'https://nocode.meituan.com/photo/search?keyword=老边饺子馆&width=400&height=300', 'B000A8URXS', FLOOR(RANDOM() * 1000) + 100, TRUE, random_ranking_score()),
('大连焖子', '美食', random_rating(), random_price(25), '高新区', '地方特色', '大连市高新区黄浦路1号', 38.876543, 121.527513, '0411-84567890', '08:00-20:00', '大连传统小吃，以红薯淀粉为主料，口感Q弹，搭配蒜泥和芝麻酱', 'https://nocode.meituan.com/photo/search?keyword=大连焖子&width=400&height=300', 'B000A8URXT', FLOOR(RANDOM() * 1000) + 100, FALSE, random_ranking_score()),
('渔人码头', '美食', random_rating(), random_price(120), '沙河口区', '海鲜餐厅', '大连市沙河口区星海广场B3区', 38.91459, 121.618622, '0411-84678901', '11:00-22:00', '位于星海广场的海鲜餐厅，环境优雅，主打各种新鲜海鱼和贝类', 'https://nocode.meituan.com/photo/search?keyword=渔人码头海鲜餐厅&width=400&height=300', 'B000A8URXU', FLOOR(RANDOM() * 1000) + 100, TRUE, random_ranking_score()),
('喜家德虾仁水饺', '美食', random_rating(), random_price(45), '西岗区', '连锁水饺', '大连市西岗区中山路168号', 38.91459, 121.618622, '0411-83601234', '10:00-21:30', '知名连锁水饺品牌，招牌虾仁三鲜水饺，皮薄馅大，汤汁鲜美', 'https://nocode.meituan.com/photo/search?keyword=喜家德虾仁水饺&width=400&height=300', 'B000A8URXV', FLOOR(RANDOM() * 1000) + 100, FALSE, random_ranking_score()),
('不二心包子铺', '美食', random_rating(), random_price(15), '中山区', '早餐包子', '大连市中山区天津街89号', 38.91459, 121.618622, '0411-82734567', '06:00-14:00', '大连老字号包子铺，招牌鲜肉包和酸菜包，皮薄馅足，汤汁丰富', 'https://nocode.meituan.com/photo/search?keyword=不二心包子铺&width=400&height=300', 'B000A8URXW', FLOOR(RANDOM() * 1000) + 100, FALSE, random_ranking_score()),
('正黄旗烧烤', '美食', random_rating(), random_price(65), '甘井子区', '烧烤', '大连市甘井子区山东路商业街', 38.973094, 121.583333, '0411-86667788', '17:00-02:00', '大连知名烧烤店，特色烤羊肉串、烤生蚝和烤茄子，夜宵好去处', 'https://nocode.meituan.com/photo/search?keyword=正黄旗烧烤&width=400&height=300', 'B000A8URXX', FLOOR(RANDOM() * 1000) + 100, TRUE, random_ranking_score()),
('糯米香', '美食', random_rating(), random_price(35), '沙河口区', '东北菜', '大连市沙河口区西安路107号', 38.91459, 121.618622, '0411-84512345', '10:30-21:00', '正宗东北菜餐厅，招牌菜有锅包肉、地三鲜和东北大拉皮', 'https://nocode.meituan.com/photo/search?keyword=糯米香东北菜&width=400&height=300', 'B000A8URXY', FLOOR(RANDOM() * 1000) + 100, FALSE, random_ranking_score()),
('天天渔港', '美食', random_rating(), random_price(150), '中山区', '高端海鲜', '大连市中山区人民路98号', 38.91459, 121.618622, '0411-82567890', '11:00-14:00,17:00-21:00', '高端海鲜餐厅，以帝王蟹、澳洲龙虾等进口海鲜为主打', 'https://nocode.meituan.com/photo/search?keyword=天天渔港海鲜&width=400&height=300', 'B000A8URXZ', FLOOR(RANDOM() * 1000) + 100, TRUE, random_ranking_score()),
('王记酱骨头', '美食', random_rating(), random_price(55), '西岗区', '东北菜', '大连市西岗区北京街123号', 38.91459, 121.618622, '0411-83678901', '10:00-21:30', '以酱骨头为招牌的东北菜餐厅，骨头炖得软烂入味，配菜丰富', 'https://nocode.meituan.com/photo/search?keyword=王记酱骨头&width=400&height=300', 'B000A8URYA', FLOOR(RANDOM() * 1000) + 100, FALSE, random_ranking_score());

-- 插入景点类商家数据
INSERT INTO merchant_rankings (
  name, category, rating, price, area, tag, address, latitude, longitude, 
  phone, business_hours, description, image_url, amap_id, favorite_count, 
  is_featured, ranking_score
) VALUES 
('星海广场', '景点', random_rating(), 0, '沙河口区', '必游景点', '大连市沙河口区中山路1号', 38.91459, 121.618622, '0411-84671234', '全天开放', '亚洲最大的城市广场，可欣赏海景和城市天际线，是大连的标志性景点', 'https://nocode.meituan.com/photo/search?keyword=星海广场&width=400&height=300', 'B000A8URYB', FLOOR(RANDOM() * 1000) + 100, TRUE, random_ranking_score()),
('老虎滩海洋公园', '景点', random_rating(), random_price(200), '中山区', '亲子推荐', '大连市中山区滨海路1号', 38.930556, 121.679444, '0411-82403888', '08:00-17:00', '国家5A级旅游景区，有海洋动物表演、极地馆和珊瑚馆，适合全家游玩', 'https://nocode.meituan.com/photo/search?keyword=老虎滩海洋公园&width=400&height=300', 'B000A8URYC', FLOOR(RANDOM() * 1000) + 100, TRUE, random_ranking_score()),
('金石滩', '景点', random_rating(), random_price(280), '金州区', '自然风光', '大连市金州区金石滩国家旅游度假区', 39.016667, 122.033333, '0411-87951666', '08:00-17:00', '大连最美海滩，有奇特的地质景观和清澈的海水，是摄影爱好者的天堂', 'https://nocode.meituan.com/photo/search?keyword=金石滩&width=400&height=300', 'B000A8URYD', FLOOR(RANDOM() * 1000) + 100, FALSE, random_ranking_score()),
('大连森林动物园', '景点', random_rating(), random_price(120), '西岗区', '亲子推荐', '大连市西岗区迎春路60号', 38.91459, 121.618622, '0411-84675678', '08:30-16:30', '东北地区最大的森林动物园，有熊猫馆、长颈鹿馆等，适合带孩子游玩', 'https://nocode.meituan.com/photo/search?keyword=大连森林动物园&width=400&height=300', 'B000A8URYE', FLOOR(RANDOM() * 1000) + 100, TRUE, random_ranking_score()),
('东港音乐喷泉', '景点', random_rating(), 0, '中山区', '夜景', '大连市中山区东港商务区', 38.91459, 121.618622, '0411-82734567', '19:00-20:00(夏季)', '大型音乐喷泉表演，配合灯光和音乐，是大连夜晚的亮点', 'https://nocode.meituan.com/photo/search?keyword=东港音乐喷泉&width=400&height=300', 'B000A8URYF', FLOOR(RANDOM() * 1000) + 100, FALSE, random_ranking_score()),
('大连现代博物馆', '景点', random_rating(), random_price(30), '沙河口区', '文化', '大连市沙河口区会展路18号', 38.91459, 121.618622, '0411-84805555', '09:00-17:00(周一闭馆)', '展示大连历史文化和现代发展的综合性博物馆', 'https://nocode.meituan.com/photo/search?keyword=大连现代博物馆&width=400&height=300', 'B000A8URYG', FLOOR(RANDOM() * 1000) + 100, FALSE, random_ranking_score()),
('俄罗斯风情街', '景点', random_rating(), 0, '西岗区', '历史文化', '大连市西岗区团结街', 38.91459, 121.618622, '0411-83601234', '全天开放', '保存完好的俄式建筑群，可以体验异国风情和购买特色商品', 'https://nocode.meituan.com/photo/search?keyword=俄罗斯风情街&width=400&height=300', 'B000A8URYH', FLOOR(RANDOM() * 1000) + 100, FALSE, random_ranking_score()),
('大连自然博物馆', '景点', random_rating(), random_price(25), '沙河口区', '科普', '大连市沙河口区黑石礁街46号', 38.91459, 121.618622, '0411-84679123', '09:00-17:00(周一闭馆)', '展示海洋生物和自然标本的博物馆，有丰富的鲸鱼和恐龙化石', 'https://nocode.meituan.com/photo/search?keyword=大连自然博物馆&width=400&height=300', 'B000A8URYI', FLOOR(RANDOM() * 1000) + 100, FALSE, random_ranking_score()),
('发现王国', '景点', random_rating(), random_price(240), '金州区', '主题乐园', '大连市金州区金石滩国家旅游度假区', 39.016667, 122.033333, '0411-87956565', '09:00-17:00', '大型主题乐园，有惊险刺激的过山车和精彩的表演', 'https://nocode.meituan.com/photo/search?keyword=大连发现王国&width=400&height=300', 'B000A8URYJ', FLOOR(RANDOM() * 1000) + 100, TRUE, random_ranking_score()),
('滨海路', '景点', random_rating(), 0, '中山区', '自然风光', '大连市中山区滨海路', 38.91459, 121.618622, '0411-82567890', '全天开放', '大连最美的海滨公路，沿途可欣赏海景和山景，适合徒步和骑行', 'https://nocode.meituan.com/photo/search?keyword=大连滨海路&width=400&height=300', 'B000A8URYK', FLOOR(RANDOM() * 1000) + 100, FALSE, random_ranking_score());

-- 插入酒店类商家数据
INSERT INTO merchant_rankings (
  name, category, rating, price, area, tag, address, latitude, longitude, 
  phone, business_hours, description, image_url, amap_id, favorite_count, 
  is_featured, ranking_score
) VALUES 
('香格里拉大酒店', '酒店', random_rating(), random_price(680), '中山区', '豪华住宿', '大连市中山区人民路1号', 38.91459, 121.618622, '0411-88888888', '24小时', '国际五星级酒店，位于市中心，设施完善，服务一流', 'https://nocode.meituan.com/photo/search?keyword=香格里拉大酒店&width=400&height=300', 'B000A8URYL', FLOOR(RANDOM() * 1000) + 100, TRUE, random_ranking_score()),
('大连富丽华大酒店', '酒店', random_rating(), random_price(580), '西岗区', '商务首选', '大连市西岗区中山路1号', 38.91459, 121.618622, '0411-82808888', '24小时', '大连地标性酒店，历史悠久，地理位置优越', 'https://nocode.meituan.com/photo/search?keyword=大连富丽华大酒店&width=400&height=300', 'B000A8URYM', FLOOR(RANDOM() * 1000) + 100, TRUE, random_ranking_score()),
('海景酒店', '酒店', random_rating(), random_price(480), '甘井子区', '海景房', '大连市甘井子区滨海路1号', 38.973094, 121.583333, '0411-86666666', '24小时', '面朝大海的酒店，部分房间可欣赏到美丽的海景', 'https://nocode.meituan.com/photo/search?keyword=海景酒店&width=400&height=300', 'B000A8URYN', FLOOR(RANDOM() * 1000) + 100, FALSE, random_ranking_score()),
('一方城堡豪华精选酒店', '酒店', random_rating(), random_price(880), '沙河口区', '豪华住宿', '大连市沙河口区滨海路200号', 38.91459, 121.618622, '0411-84678901', '24小时', '城堡式建筑，位于星海广场附近，可俯瞰整个星海湾', 'https://nocode.meituan.com/photo/search?keyword=一方城堡酒店&width=400&height=300', 'B000A8URO', FLOOR(RANDOM() * 1000) + 100, TRUE, random_ranking_score()),
('康莱德酒店', '酒店', random_rating(), random_price(780), '中山区', '豪华住宿', '大连市中山区人民路71号', 38.91459, 121.618622, '0411-82567890', '24小时', '国际连锁豪华酒店，位于市中心商业区，交通便利', 'https://nocode.meituan.com/photo/search?keyword=康莱德酒店&width=400&height=300', 'B000A8URYP', FLOOR(RANDOM() * 1000) + 100, FALSE, random_ranking_score()),
('日航饭店', '酒店', random_rating(), random_price(520), '中山区', '商务酒店', '大连市中山区天津街228号', 38.91459, 121.618622, '0411-82734567', '24小时', '日本品牌酒店，服务细致，位于市中心商业区', 'https://nocode.meituan.com/photo/search?keyword=日航饭店&width=400&height=300', 'B000A8URYQ', FLOOR(RANDOM() * 1000) + 100, FALSE, random_ranking_score()),
('万达希尔顿酒店', '酒店', random_rating(), random_price(620), '西岗区', '豪华住宿', '大连市西岗区中山路162号', 38.91459, 121.618622, '0411-83601234', '24小时', '希尔顿品牌酒店，位于万达广场，购物出行便利', 'https://nocode.meituan.com/photo/search?keyword=万达希尔顿酒店&width=400&height=300', 'B000A8URYR', FLOOR(RANDOM() * 1000) + 100, FALSE, random_ranking_score()),
('国宾山庄', '酒店', random_rating(), random_price(380), '甘井子区', '度假山庄', '大连市甘井子区红旗西路1号', 38.973094, 121.583333, '0411-84567890', '24小时', '环境幽雅的度假山庄，远离市区喧嚣，适合休闲度假', 'https://nocode.meituan.com/photo/search?keyword=国宾山庄&width=400&height=300', 'B000A8URYS', FLOOR(RANDOM() * 1000) + 100, FALSE, random_ranking_score()),
('海韵温泉酒店', '酒店', random_rating(), random_price(450), '金州区', '温泉酒店', '大连市金州区金石滩国家旅游度假区', 39.016667, 122.033333, '0411-87951666', '24小时', '位于金石滩的温泉酒店，可享受温泉浴和海滩度假', 'https://nocode.meituan.com/photo/search?keyword=海韵温泉酒店&width=400&height=300', 'B000A8URYT', FLOOR(RANDOM() * 1000) + 100, FALSE, random_ranking_score()),
('星海假日酒店', '酒店', random_rating(), random_price(350), '沙河口区', '商务酒店', '大连市沙河口区星海广场A区', 38.91459, 121.618622, '0411-84675678', '24小时', '位于星海广场的商务酒店，交通便利，周边景点丰富', 'https://nocode.meituan.com/photo/search?keyword=星海假日酒店&width=400&height=300', 'B000A8URYU', FLOOR(RANDOM() * 1000) + 100, FALSE, random_ranking_score());

-- 插入购物类商家数据
INSERT INTO merchant_rankings (
  name, category, rating, price, area, tag, address, latitude, longitude, 
  phone, business_hours, description, image_url, amap_id, favorite_count, 
  is_featured, ranking_score
) VALUES 
('大连商场', '购物', random_rating(), 0, '中山区', '购物中心', '大连市中山区中山路1号', 38.91459, 121.618622, '0411-88888888', '10:00-22:00', '大连最大的购物中心，汇集国内外知名品牌，是购物的首选之地', 'https://nocode.meituan.com/photo/search?keyword=大连商场&width=400&height=300', 'B000A8URYV', FLOOR(RANDOM() * 1000) + 100, TRUE, random_ranking_score()),
('新玛特购物中心', '购物', random_rating(), 0, '沙河口区', '购物中心', '大连市沙河口区西安路1号', 38.91459, 121.618622, '0411-86666666', '10:00-22:00', '大连知名购物中心，有超市、餐饮和娱乐设施', 'https://nocode.meituan.com/photo/search?keyword=新玛特购物中心&width=400&height=300', 'B000A8URYW', FLOOR(RANDOM() * 1000) + 100, FALSE, random_ranking_score()),
('百年城', '购物', random_rating(), 0, '中山区', '高端购物', '大连市中山区解放路188号', 38.91459, 121.618622, '0411-82567890', '10:00-22:00', '高端购物中心，汇集奢侈品牌和设计师品牌', 'https://nocode.meituan.com/photo/search?keyword=百年城购物中心&width=400&height=300', 'B000A8URYX', FLOOR(RANDOM() * 1000) + 100, FALSE, random_ranking_score()),
('凯德和平广场', '购物', random_rating(), 0, '沙河口区', '购物中心', '大连市沙河口区高尔基路695号', 38.91459, 121.618622, '0411-84678901', '10:00-22:00', '位于和平广场的购物中心，有电影院和餐饮娱乐', 'https://nocode.meituan.com/photo/search?keyword=凯德和平广场&width=400&height=300', 'B000A8URYY', FLOOR(RANDOM() * 1000) + 100, FALSE, random_ranking_score()),
('罗斯福天兴购物中心', '购物', random_rating(), 0, '沙河口区', '购物中心', '大连市沙河口区西安路132号', 38.91459, 121.618622, '0411-84567890', '10:00-22:00', '集购物、餐饮、娱乐于一体的综合性购物中心', 'https://nocode.meituan.com/photo/search?keyword=罗斯福天兴购物中心&width=400&height=300', 'B000A8URYZ', FLOOR(RANDOM() * 1000) + 100, FALSE, random_ranking_score()),
('恒隆广场', '购物', random_rating(), 0, '西岗区', '高端购物', '大连市西岗区五四路66号', 38.91459, 121.618622, '0411-83601234', '10:00-22:00', '高端购物中心，有国际一线品牌和精品超市', 'https://nocode.meituan.com/photo/search?keyword=恒隆广场&width=400&height=300', 'B000A8URZA', FLOOR(RANDOM() * 1000) + 100, TRUE, random_ranking_score()),
('柏威年购物中心', '购物', random_rating(), 0, '中山区', '购物中心', '大连市中山区长江路128号', 38.91459, 121.618622, '0411-82734567', '10:00-22:00', '位于市中心的购物中心，有时尚品牌和餐饮娱乐', 'https://nocode.meituan.com/photo/search?keyword=柏威年购物中心&width=400&height=300', 'B000A8URZB', FLOOR(RANDOM() * 1000) + 100, FALSE, random_ranking_score()),
('中央大道旅游购物中心', '购物', random_rating(), 0, '沙河口区', '购物中心', '大连市沙河口区西安路107号', 38.91459, 121.618622, '0411-84675678', '10:00-22:00', '集购物、旅游、文化于一体的综合性购物中心', 'https://nocode.meituan.com/photo/search?keyword=中央大道购物中心&width=400&height=300', 'B000A8URZC', FLOOR(RANDOM() * 1000) + 100, FALSE, random_ranking_score()),
('大都会购物中心', '购物', random_rating(), 0, '中山区', '购物中心', '大连市中山区天津街200号', 38.91459, 121.618622, '0411-82567890', '10:00-22:00', '位于天津街商业区，有时尚品牌和餐饮娱乐', 'https://nocode.meituan.com/photo/search?keyword=大都会购物中心&width=400&height=300', 'B000A8URZD', FLOOR(RANDOM() * 1000) + 100, FALSE, random_ranking_score()),
('胜利地下购物中心', '购物', random_rating(), 0, '中山区', '地下商场', '大连市中山区胜利广场地下', 38.91459, 121.618622, '0411-82734567', '10:00-22:00', '位于胜利广场地下的购物中心，有各类小商品和特色店铺', 'https://nocode.meituan.com/photo/search?keyword=胜利地下购物中心&width=400&height=300', 'B000A8URZE', FLOOR(RANDOM() * 1000) + 100, FALSE, random_ranking_score());

-- 插入娱乐类商家数据
INSERT INTO merchant_rankings (
  name, category, rating, price, area, tag, address, latitude, longitude, 
  phone, business_hours, description, image_url, amap_id, favorite_count, 
  is_featured, ranking_score
) VALUES 
('万达影城', '娱乐', random_rating(), random_price(50), '中山区', '电影院', '大连市中山区人民路1号', 38.91459, 121.618622, '0411-88888888', '10:00-24:00', '大连知名电影院，有IMAX厅和4D影厅，观影体验佳', 'https://nocode.meituan.com/photo/search?keyword=万达影城&width=400&height=300', 'B000A8URZF', FLOOR(RANDOM() * 1000) + 100, TRUE, random_ranking_score()),
('KTV欢乐时光', '娱乐', random_rating(), random_price(200), '甘井子区', 'KTV', '大连市甘井子区华东路1号', 38.973094, 121.583333, '0411-87654321', '18:00-02:00', '大连知名KTV，包厢环境好，歌曲库丰富', 'https://nocode.meituan.com/photo/search?keyword=KTV&width=400&height=300', 'B000A8URZG', FLOOR(RANDOM() * 1000) + 100, FALSE, random_ranking_score()),
('大玩家超乐场', '娱乐', random_rating(), random_price(80), '沙河口区', '电玩城', '大连市沙河口区西安路107号', 38.91459, 121.618622, '0411-84678901', '10:00-22:00', '大型电玩城，有各种游戏机和娱乐设施', 'https://nocode.meituan.com/photo/search?keyword=大玩家超乐场&width=400&height=300', 'B000A8URZH', FLOOR(RANDOM() * 1000) + 100, FALSE, random_ranking_score()),
('星海湾游艇俱乐部', '娱乐', random_rating(), random_price(500), '沙河口区', '游艇', '大连市沙河口区星海湾', 38.91459, 121.618622, '0411-84567890', '09:00-18:00', '提供游艇租赁和海上观光服务，可欣赏星海湾美景', 'https://nocode.meituan.com/photo/search?keyword=星海湾游艇俱乐部&width=400&height=300', 'B000A8URZI', FLOOR(RANDOM() * 1000) + 100, FALSE, random_ranking_score()),
('大连一方城堡豪华精选酒店', '娱乐', random_rating(), random_price(300), '沙河口区', '酒店娱乐', '大连市沙河口区滨海路200号', 38.91459, 121.618622, '0411-84678901', '24小时', '城堡酒店内的娱乐设施，有游泳池、健身房和水疗中心', 'https://nocode.meituan.com/photo/search?keyword=一方城堡酒店&width=400&height=300', 'B000A8URZJ', FLOOR(RANDOM() * 1000) + 100, FALSE, random_ranking_score()),
('发现王国', '娱乐', random_rating(), random_price(240), '金州区', '主题乐园', '大连市金州区金石滩国家旅游度假区', 39.016667, 122.033333, '0411-87956565', '09:00-17:00', '大型主题乐园，有惊险刺激的过山车和精彩的表演', 'https://nocode.meituan.com/photo/search?keyword=大连发现王国&width=400&height=300', 'B000A8URZK', FLOOR(RANDOM() * 1000) + 100, TRUE, random_ranking_score()),
('大连森林动物园', '娱乐', random_rating(), random_price(120), '西岗区', '亲子娱乐', '大连市西岗区迎春路60号', 38.91459, 121.618622, '0411-84675678', '08:30-16:30', '东北地区最大的森林动物园，适合全家游玩', 'https://nocode.meituan.com/photo/search?keyword=大连森林动物园&width=400&height=300', 'B000A8URZL', FLOOR(RANDOM() * 1000) + 100, FALSE, random_ranking_score()),
('大连一方城堡豪华精选酒店', '娱乐', random_rating(), random_price(300), '沙河口区', '酒店娱乐', '大连市沙河口区滨海路200号', 38.91459, 121.618622, '0411-84678901', '24小时', '城堡酒店内的娱乐设施，有游泳池、健身房和水疗中心', 'https://nocode.meituan.com/photo/search?keyword=一方城堡酒店&width=400&height=300', 'B000A8URZM', FLOOR(RANDOM() * 1000) + 100, FALSE, random_ranking_score()),
('大连一方城堡豪华精选酒店', '娱乐', random_rating(), random_price(300), '沙河口区', '酒店娱乐', '大连市沙河口区滨海路200号', 38.91459, 121.618622, '0411-84678901', '24小时', '城堡酒店内的娱乐设施，有游泳池、健身房和水疗中心', 'https://nocode.meituan.com/photo/search?keyword=一方城堡酒店&width=400&height=300', 'B000A8URZN', FLOOR(RANDOM() * 1000) + 100, FALSE, random_ranking_score()),
('大连一方城堡豪华精选酒店', '娱乐', random_rating(), random_price(300), '沙河口区', '酒店娱乐', '大连市沙河口区滨海路200号', 38.91459, 121.618622, '0411-84678901', '24小时', '城堡酒店内的娱乐设施，有游泳池、健身房和水疗中心', 'https://nocode.meituan.com/photo/search?keyword=一方城堡酒店&width=400&height=300', 'B000A8URZO', FLOOR(RANDOM() * 1000) + 100, FALSE, random_ranking_score());

-- 为每个分类添加更多数据以达到100+条记录
-- 这里使用循环插入更多数据
DO $$
DECLARE
  i INTEGER;
  categories TEXT[] := ARRAY['美食', '景点', '酒店', '购物', '娱乐'];
  category TEXT;
BEGIN
  FOREACH category IN ARRAY categories LOOP
    FOR i IN 1..20 LOOP
      INSERT INTO merchant_rankings (
        name, category, rating, price, area, tag, address, latitude, longitude, 
        phone, business_hours, description, image_url, amap_id, favorite_count, 
        is_featured, ranking_score
      ) VALUES (
        category || '商家' || i, 
        category, 
        random_rating(), 
        CASE WHEN category = '景点' THEN 0 ELSE random_price(100) END,
        CASE 
          WHEN category = '美食' THEN '中山区'
          WHEN category = '景点' THEN '沙河口区'
          WHEN category = '酒店' THEN '西岗区'
          WHEN category = '购物' THEN '甘井子区'
          WHEN category = '娱乐' THEN '高新区'
        END,
        CASE 
          WHEN category = '美食' THEN '人气推荐'
          WHEN category = '景点' THEN '必游景点'
          WHEN category = '酒店' THEN '豪华住宿'
          WHEN category = '购物' THEN '购物中心'
          WHEN category = '娱乐' THEN '休闲娱乐'
        END,
        '大连市' || 
        CASE 
          WHEN category = '美食' THEN '中山区'
          WHEN category = '景点' THEN '沙河口区'
          WHEN category = '酒店' THEN '西岗区'
          WHEN category = '购物' THEN '甘井子区'
          WHEN category = '娱乐' THEN '高新区'
        END || '中山路' || i || '号',
        38.91459 + (RANDOM() - 0.5) * 0.1,
        121.618622 + (RANDOM() - 0.5) * 0.1,
        '0411-' || FLOOR(RANDOM() * 90000000 + 10000000)::TEXT,
        CASE 
          WHEN category = '酒店' THEN '24小时'
          WHEN category = '娱乐' THEN '18:00-02:00'
          ELSE '10:00-22:00'
        END,
        category || '商家描述' || i,
        'https://nocode.meituan.com/photo/search?keyword=' || category || '商家' || i || '&width=400&height=300',
        'B000A8U' || category || i,
        FLOOR(RANDOM() * 1000) + 100,
        RANDOM() > 0.7,
        random_ranking_score()
      );
    END LOOP;
  END LOOP;
END $$;

-- 清理临时函数
DROP FUNCTION IF EXISTS random_rating();
DROP FUNCTION IF EXISTS random_price(DECIMAL);
DROP FUNCTION IF EXISTS random_ranking_score();
