import { useMutation } from '@tanstack/react-query';
import { populateDatabase } from '@/scripts/populateDatabase';

export const usePopulateDatabase = () => {
  return useMutation({
    mutationFn: async () => {
      return await populateDatabase();
    },
  });
};
