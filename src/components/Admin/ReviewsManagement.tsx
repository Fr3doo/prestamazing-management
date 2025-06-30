
import React from 'react';
import { useReviewsManager } from '@/hooks/useReviewsManager';
import ReviewsHeader from './Reviews/ReviewsHeader';
import ReviewsList from './Reviews/ReviewsList';
import ReviewsLoading from './Reviews/ReviewsLoading';
import ReviewsFormWrapper from './Reviews/ReviewsFormWrapper';

const ReviewsManagement = () => {
  const { state, actions } = useReviewsManager();

  if (state.loading) {
    return <ReviewsLoading />;
  }

  return (
    <div className="p-6">
      <ReviewsHeader onAddReview={actions.handleAddReview} />

      {state.showForm && (
        <ReviewsFormWrapper
          editingReview={state.editingReview}
          onSuccess={actions.handleFormSuccess}
          onCancel={actions.handleFormCancel}
        />
      )}

      <ReviewsList
        reviews={state.reviews}
        onEdit={actions.handleEdit}
        onDelete={actions.handleDelete}
      />
    </div>
  );
};

export default ReviewsManagement;
