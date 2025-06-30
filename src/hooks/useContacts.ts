
import { useOptimizedDataFetching } from './useOptimizedDataFetching';
import { useRepositories } from './useRepositories';
import { useCallback } from 'react';
import { ContactInfo, CreateContactInfoData } from '@/interfaces/repositories/IContactRepository';

export const useContacts = () => {
  const { contactRepository } = useRepositories();

  const {
    data: contactInfo,
    loading,
    error,
    refetch
  } = useOptimizedDataFetching(
    () => contactRepository.getAllContactInfo(),
    {
      errorContext: 'Contact info fetching',
      enableCache: true,
      cacheKey: 'contact-info-all',
      initialData: []
    }
  );

  const createContactInfo = useCallback(async (contactData: CreateContactInfoData) => {
    const result = await contactRepository.createContactInfo(contactData);
    refetch(); // Refresh the list after creation
    return result;
  }, [contactRepository, refetch]);

  const updateContactInfo = useCallback(async (id: string, contactData: Partial<CreateContactInfoData>) => {
    const result = await contactRepository.updateContactInfo(id, contactData);
    refetch(); // Refresh the list after update
    return result;
  }, [contactRepository, refetch]);

  const deleteContactInfo = useCallback(async (id: string) => {
    await contactRepository.deleteContactInfo(id);
    refetch(); // Refresh the list after deletion
  }, [contactRepository, refetch]);

  return {
    contactInfo: contactInfo || [],
    loading,
    error,
    refetch,
    createContactInfo,
    updateContactInfo,
    deleteContactInfo
  };
};
