
import { useOptimizedDataFetching } from './useOptimizedDataFetching';
import { useRepositories } from './useRepositories';
import { useCallback } from 'react';
import { Review, CreateReviewData, UpdateReviewData } from '@/interfaces/repositories/IReviewRepository';

export const useReviews = () => {
  const { reviewRepository } = useRepositories();

  const {
    data: reviews,
    loading,
    error,
    refetch
  } = useOptimizedDataFetching(
    () => reviewRepository.getAllReviews(),
    {
      errorContext: 'Reviews fetching',
      enableCache: true,
      cacheKey: 'reviews-all',
      initialData: []
    }
  );

  const createReview = useCallback(async (reviewData: CreateReviewData) => {
    const result = await reviewRepository.createReview(reviewData);
    refetch(); // Refresh the list after creation
    return result;
  }, [reviewRepository, refetch]);

  const updateReview = useCallback(async (id: string, reviewData: Partial<Review>) => {
    const updateData: UpdateReviewData = {
      ...reviewData,
      updated_at: new Date().toISOString()
    };
    const result = await reviewRepository.updateReview(id, updateData);
    refetch(); // Refresh the list after update
    return result;
  }, [reviewRepository, refetch]);

  const deleteReview = useCallback(async (id: string) => {
    await reviewRepository.deleteReview(id);
    refetch(); // Refresh the list after deletion
  }, [reviewRepository, refetch]);

  return {
    reviews: reviews || [],
    loading,
    error,
    refetch,
    createReview,
    updateReview,
    deleteReview
  };
};
