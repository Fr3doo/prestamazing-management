
import { useOptimizedDataFetching } from './useOptimizedDataFetching';
import { useRepositories } from './useRepositories';
import { useCallback } from 'react';
import { Partner, CreatePartnerData, UpdatePartnerData } from '@/interfaces/repositories/IPartnerRepository';

export const usePartners = () => {
  const { partnerRepository } = useRepositories();

  const {
    data: partners,
    loading,
    error,
    refetch
  } = useOptimizedDataFetching(
    () => partnerRepository.getAllPartners(),
    {
      errorContext: 'Partners fetching',
      enableCache: true,
      cacheKey: 'partners-all',
      initialData: []
    }
  );

  const createPartner = useCallback(async (partnerData: CreatePartnerData) => {
    const result = await partnerRepository.createPartner(partnerData);
    refetch(); // Refresh the list after creation
    return result;
  }, [partnerRepository, refetch]);

  const updatePartner = useCallback(async (id: string, partnerData: UpdatePartnerData) => {
    const result = await partnerRepository.updatePartner(id, partnerData);
    refetch(); // Refresh the list after update
    return result;
  }, [partnerRepository, refetch]);

  const deletePartner = useCallback(async (id: string) => {
    await partnerRepository.deletePartner(id);
    refetch(); // Refresh the list after deletion
  }, [partnerRepository, refetch]);

  const updatePartnerOrder = useCallback(async (partnerId: string, newOrder: number) => {
    await partnerRepository.updatePartnerOrder(partnerId, newOrder);
    refetch(); // Refresh the list after reordering
  }, [partnerRepository, refetch]);

  return {
    partners: partners || [],
    loading,
    error,
    refetch,
    createPartner,
    updatePartner,
    deletePartner,
    updatePartnerOrder
  };
};
