
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Review {
  id: string;
  user_name: string;
  comment: string;
  rating: number;
  created_at: string;
  updated_at: string;
}

export interface ReviewsManagerState {
  reviews: Review[];
  loading: boolean;
  showForm: boolean;
  editingReview: Review | null;
}

export interface ReviewsManagerActions {
  fetchReviews: () => Promise<void>;
  handleDelete: (id: string) => Promise<void>;
  handleEdit: (review: Review) => void;
  handleFormSuccess: () => void;
  handleFormCancel: () => void;
  handleAddReview: () => void;
}

export const useReviewsManager = () => {
  const [state, setState] = useState<ReviewsManagerState>({
    reviews: [],
    loading: true,
    showForm: false,
    editingReview: null,
  });

  const { toast } = useToast();

  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setState(prev => ({ ...prev, reviews: data || [], loading: false }));
    } catch (error) {
      console.error('Erreur lors du chargement des avis:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les avis",
        variant: "destructive",
      });
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet avis ?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setState(prev => ({
        ...prev,
        reviews: prev.reviews.filter(review => review.id !== id)
      }));
      
      toast({
        title: "Succès",
        description: "Avis supprimé avec succès",
      });
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'avis",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (review: Review) => {
    setState(prev => ({
      ...prev,
      editingReview: review,
      showForm: true
    }));
  };

  const handleFormSuccess = () => {
    setState(prev => ({
      ...prev,
      showForm: false,
      editingReview: null
    }));
    fetchReviews();
  };

  const handleFormCancel = () => {
    setState(prev => ({
      ...prev,
      showForm: false,
      editingReview: null
    }));
  };

  const handleAddReview = () => {
    setState(prev => ({
      ...prev,
      showForm: true,
      editingReview: null
    }));
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const actions: ReviewsManagerActions = {
    fetchReviews,
    handleDelete,
    handleEdit,
    handleFormSuccess,
    handleFormCancel,
    handleAddReview,
  };

  return { state, actions };
};
