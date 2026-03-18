import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { merchants } from '@/data/merchants';

export const useMerchantData = () => {
  // 获取商家列表
  const useMerchants = (category = null, area = null) => {
    return useQuery({
      queryKey: ['merchants', category, area],
      queryFn: async () => {
        let result = [...merchants];
        if (category) {
          result = result.filter(m => m.category === category);
        }
        if (area) {
          result = result.filter(m => m.area === area);
        }
        result.sort((a, b) => b.ranking_score - a.ranking_score);
        return result;
      },
      staleTime: 5 * 60 * 1000,
    });
  };

  // 获取单个商家详情
  const useMerchant = (id) => {
    return useQuery({
      queryKey: ['merchant', id],
      queryFn: async () => {
        return merchants.find(m => m.id === id) || null;
      },
    });
  };

  // 获取排行榜数据
  const useRankingList = (category = '美食', limit = 20) => {
    return useQuery({
      queryKey: ['ranking-list', category, limit],
      queryFn: async () => {
        let result = merchants.filter(m => m.category === category);
        result.sort((a, b) => b.ranking_score - a.ranking_score);
        return result.slice(0, limit);
      },
      staleTime: 15 * 60 * 1000,
    });
  };

  // 获取热门商家
  const useFeaturedMerchants = () => {
    return useQuery({
      queryKey: ['featured-merchants'],
      queryFn: async () => {
        let result = merchants.filter(m => m.is_featured === true);
        result.sort((a, b) => b.ranking_score - a.ranking_score);
        return result.slice(0, 10);
      },
      staleTime: 10 * 60 * 1000,
    });
  };

  // 添加商家（stub）
  const useAddMerchant = () => {
    return useMutation({
      mutationFn: async () => {},
    });
  };

  // 更新商家信息（stub）
  const useUpdateMerchant = () => {
    return useMutation({
      mutationFn: async () => {},
    });
  };

  // 从高德地图同步（stub）
  const useSyncFromAmap = () => {
    return useMutation({
      mutationFn: async () => {},
    });
  };

  return {
    useMerchants,
    useMerchant,
    useAddMerchant,
    useUpdateMerchant,
    useSyncFromAmap,
    useFeaturedMerchants,
    useRankingList,
  };
};
