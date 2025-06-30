
import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  onRatingChange: (rating: number) => void;
  label?: string;
  required?: boolean;
  error?: string;
  fieldId: string;
}

const StarRating = ({ 
  rating, 
  onRatingChange, 
  label = "Note", 
  required = false, 
  error,
  fieldId 
}: StarRatingProps) => {
  const errorId = `${fieldId}-error`;

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onRatingChange(star)}
            className="text-2xl hover:scale-110 transition-transform"
            aria-describedby={error ? errorId : undefined}
          >
            <Star
              className={`h-6 w-6 ${
                star <= rating
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
        <span className="ml-2 text-sm text-gray-600">
          {rating}/5 étoiles
        </span>
      </div>
      
      {error && (
        <p id={errorId} className="text-red-500 text-sm" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

export default StarRating;
