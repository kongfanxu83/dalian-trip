import { supabase } from '@/integrations/supabase/client';
import amapService from '@/services/amapService';

// 填充数据库的函数
export const populateDatabase = async () => {
  try {
    console.log('开始填充数据库...');
    
    // 获取所有大连POI数据
    const allPOIs = await amapService.getAllDalianPOIs();
    
    if (allPOIs.length === 0) {
      console.error('未获取到POI数据');
      return;
    }
    
    console.log(`获取到${allPOIs.length}条POI数据`);
    
    // 批量插入到数据库
    const { data, error } = await supabase
      .from('merchant_rankings')
      .upsert(allPOIs, { 
        onConflict: 'amap_id',
        ignoreDuplicates: false 
      })
      .select();
    
    if (error) {
      console.error('数据库插入失败:', error);
      throw error;
    }
    
    console.log(`成功插入${data.length}条数据到数据库`);
    return data;
  } catch (error) {
    console.error('填充数据库失败:', error);
    throw error;
  }
};

// 如果直接运行此脚本
if (typeof window === 'undefined') {
  populateDatabase()
    .then(data => {
      console.log('数据库填充完成');
      process.exit(0);
    })
    .catch(error => {
      console.error('数据库填充失败:', error);
      process.exit(1);
    });
}
