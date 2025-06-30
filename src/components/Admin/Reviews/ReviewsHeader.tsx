
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface ReviewsHeaderProps {
  onAddReview: () => void;
}

const ReviewsHeader = ({ onAddReview }: ReviewsHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Gestion des avis clients</h1>
        <p className="text-gray-600">Gérez les avis et témoignages de vos clients</p>
      </div>
      <Button onClick={onAddReview} className="flex items-center gap-2">
        <Plus className="h-4 w-4" />
        Ajouter un avis
      </Button>
    </div>
  );
};

export default ReviewsHeader;
