
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useStandardToast } from '@/hooks/useStandardToast';
import { useErrorHandler } from '@/hooks/useErrorHandler';

export interface Review {
  id: string;
  user_name: string;
  rating: number;
  comment: string;
  position?: string;
  company?: string;
  created_at: string;
  updated_at: string;
}

export const useReviewsManagement = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const { showSuccess, showError } = useStandardToast();
  const { handleError } = useErrorHandler();

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReviews(data || []);
    } catch (error) {
      handleError(error, { logContext: 'Reviews fetch' });
    } finally {
      setLoading(false);
    }
  };

  const deleteReview = async (id: string) => {
    try {
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setReviews(prev => prev.filter(review => review.id !== id));
      showSuccess("Succès", "Avis supprimé avec succès");
    } catch (error) {
      handleError(error, { logContext: 'Review deletion' });
    }
  };

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = !searchTerm || 
      review.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.comment.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRating = filterRating === null || review.rating === filterRating;
    
    return matchesSearch && matchesRating;
  });

  useEffect(() => {
    fetchReviews();
  }, []);

  return {
    reviews: filteredReviews,
    loading,
    searchTerm,
    setSearchTerm,
    filterRating,
    setFilterRating,
    fetchReviews,
    deleteReview,
  };
};
