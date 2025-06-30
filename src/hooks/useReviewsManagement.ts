import { useState, useCallback, useMemo } from 'react';
import { useReviews } from './useReviews';
import { useStandardToast } from './useStandardToast';
import { useErrorHandler } from './useErrorHandler';
import { Review } from '@/interfaces/repositories/IReviewRepository';

export type { Review } from '@/interfaces/repositories/IReviewRepository';

export const useReviewsManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRating, setFilterRating] = useState<number | null>(null);
  
  const {
    reviews: allReviews,
    loading,
    error,
    refetch: fetchReviews,
    deleteReview: deleteReviewBase
  } = useReviews();

  const { showSuccess } = useStandardToast();
  const { handleError } = useErrorHandler();

  // Filter reviews based on search term and rating
  const reviews = useMemo(() => {
    let filtered = allReviews;

    if (searchTerm) {
      filtered = filtered.filter(review =>
        review.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.comment.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterRating !== null) {
      filtered = filtered.filter(review => review.rating === filterRating);
    }

    return filtered;
  }, [allReviews, searchTerm, filterRating]);

  const deleteReview = useCallback(async (id: string) => {
    try {
      await deleteReviewBase(id);
      showSuccess('Avis supprimé', 'L\'avis a été supprimé avec succès.');
    } catch (error) {
      handleError(error, {
        title: 'Erreur de suppression',
        logContext: 'Review deletion'
      });
      throw error;
    }
  }, [deleteReviewBase, showSuccess, handleError]);

  return {
    reviews,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    filterRating,
    setFilterRating,
    fetchReviews,
    deleteReview,
  };
};
