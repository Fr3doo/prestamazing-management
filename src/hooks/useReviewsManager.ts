
import { useState, useCallback } from 'react';
import { useReviewsManagement, Review } from './useReviewsManagement';
import { useStandardToast } from './useStandardToast';
import { useErrorHandler } from './useErrorHandler';

export const useReviewsManager = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  
  const {
    reviews,
    loading,
    searchTerm,
    setSearchTerm,
    filterRating,
    setFilterRating,
    fetchReviews,
    deleteReview,
  } = useReviewsManagement();

  const { showSuccess } = useStandardToast();
  const { handleError } = useErrorHandler();

  const handleAddReview = useCallback(() => {
    setEditingReview(null);
    setShowForm(true);
  }, []);

  const handleEdit = useCallback((review: Review) => {
    setEditingReview(review);
    setShowForm(true);
  }, []);

  const handleDelete = useCallback(async (id: string) => {
    try {
      await deleteReview(id);
    } catch (error) {
      handleError(error, { logContext: 'Review deletion from manager' });
    }
  }, [deleteReview, handleError]);

  const handleFormSuccess = useCallback(() => {
    setEditingReview(null);
    setShowForm(false);
    fetchReviews();
  }, [fetchReviews]);

  const handleFormCancel = useCallback(() => {
    setEditingReview(null);
    setShowForm(false);
  }, []);

  return {
    state: {
      reviews,
      loading,
      showForm,
      editingReview,
      searchTerm,
      filterRating,
    },
    actions: {
      handleAddReview,
      handleEdit,
      handleDelete,
      handleFormSuccess,
      handleFormCancel,
      setSearchTerm,
      setFilterRating,
    },
  };
};
