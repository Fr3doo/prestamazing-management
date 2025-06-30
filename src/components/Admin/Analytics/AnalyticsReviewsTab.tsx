
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface RatingDistribution {
  rating: number;
  count: number;
}

interface AnalyticsReviewsTabProps {
  ratingDistribution: RatingDistribution[];
}

const AnalyticsReviewsTab = ({ ratingDistribution }: AnalyticsReviewsTabProps) => {
  const positiveReviews = ratingDistribution.filter(r => r.rating >= 4).reduce((sum, r) => sum + r.count, 0);
  const neutralReviews = ratingDistribution.find(r => r.rating === 3)?.count || 0;
  const negativeReviews = ratingDistribution.filter(r => r.rating <= 2).reduce((sum, r) => sum + r.count, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Analyse détaillée des avis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">{positiveReviews}</div>
            <div className="text-sm text-gray-600">Avis positifs (4-5⭐)</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-600">{neutralReviews}</div>
            <div className="text-sm text-gray-600">Avis neutres (3⭐)</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-red-600">{negativeReviews}</div>
            <div className="text-sm text-gray-600">Avis négatifs (1-2⭐)</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnalyticsReviewsTab;
