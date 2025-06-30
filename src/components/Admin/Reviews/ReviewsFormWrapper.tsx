
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ReviewForm from '../ReviewForm';
import { Review } from '@/hooks/useReviewsManager';

interface ReviewsFormWrapperProps {
  editingReview: Review | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const ReviewsFormWrapper = ({ editingReview, onSuccess, onCancel }: ReviewsFormWrapperProps) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>
          {editingReview ? 'Modifier l\'avis' : 'Nouvel avis'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ReviewForm
          review={editingReview}
          onSuccess={onSuccess}
          onCancel={onCancel}
        />
      </CardContent>
    </Card>
  );
};

export default ReviewsFormWrapper;
