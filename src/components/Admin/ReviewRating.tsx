
import React from 'react';
import { Star } from 'lucide-react';

interface ReviewRatingProps {
  rating: number;
  size?: 'sm' | 'md' | 'lg';
}

const ReviewRating = ({ rating, size = 'sm' }: ReviewRatingProps) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  };

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${sizeClasses[size]} ${
            star <= rating
              ? 'fill-yellow-400 text-yellow-400'
              : 'text-gray-300'
          }`}
        />
      ))}
      <span className="ml-1 text-sm text-gray-600">
        ({rating}/5)
      </span>
    </div>
  );
};

export default ReviewRating;
