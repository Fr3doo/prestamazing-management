
import { useOptimizedDataFetching } from './useOptimizedDataFetching';
import { useRepositories } from './useRepositories';
import { useCallback } from 'react';
import { ContentSection, CreateContentSectionData, UpdateContentSectionData } from '@/interfaces/repositories/IContentRepository';

export const useContent = () => {
  const { contentRepository } = useRepositories();

  const {
    data: contentSections,
    loading,
    error,
    refetch
  } = useOptimizedDataFetching(
    () => contentRepository.getAllContentSections(),
    {
      errorContext: 'Content sections fetching',
      enableCache: true,
      cacheKey: 'content-sections-all',
      initialData: []
    }
  );

  const getContentByKey = useCallback(async (key: string) => {
    return await contentRepository.getContentSectionByKey(key);
  }, [contentRepository]);

  const createContentSection = useCallback(async (contentData: CreateContentSectionData) => {
    const result = await contentRepository.createContentSection(contentData);
    refetch(); // Refresh the list after creation
    return result;
  }, [contentRepository, refetch]);

  const updateContentSection = useCallback(async (id: string, contentData: UpdateContentSectionData) => {
    const result = await contentRepository.updateContentSection(id, contentData);
    refetch(); // Refresh the list after update
    return result;
  }, [contentRepository, refetch]);

  const deleteContentSection = useCallback(async (id: string) => {
    await contentRepository.deleteContentSection(id);
    refetch(); // Refresh the list after deletion
  }, [contentRepository, refetch]);

  return {
    contentSections: contentSections || [],
    loading,
    error,
    refetch,
    getContentByKey,
    createContentSection,
    updateContentSection,
    deleteContentSection
  };
};
