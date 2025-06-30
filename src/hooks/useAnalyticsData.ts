
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface AnalyticsData {
  totalViews: number;
  totalContacts: number;
  totalReviews: number;
  avgRating: number;
  monthlyData: Array<{ month: string; contacts: number; reviews: number }>;
  ratingDistribution: Array<{ rating: number; count: number }>;
  recentActivity: Array<{ type: string; description: string; timestamp: string }>;
}

export const useAnalyticsData = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      
      // Récupération des données de base
      const [reviewsRes, contactsRes] = await Promise.all([
        supabase.from('reviews').select('*'),
        supabase.from('contact_info').select('*')
      ]);

      const reviews = reviewsRes.data || [];
      const contacts = contactsRes.data || [];

      // Calcul des moyennes et statistiques
      const avgRating = reviews.length > 0 
        ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
        : 0;

      // Distribution des notes
      const ratingDistribution = [1, 2, 3, 4, 5].map(rating => ({
        rating,
        count: reviews.filter(r => r.rating === rating).length
      }));

      // Données mensuelles simulées (en production, vous pourriez avoir des vues réelles)
      const monthlyData = [
        { month: 'Jan', contacts: 12, reviews: 8 },
        { month: 'Fév', contacts: 19, reviews: 12 },
        { month: 'Mar', contacts: 15, reviews: 10 },
        { month: 'Avr', contacts: 22, reviews: 15 },
        { month: 'Mai', contacts: 28, reviews: 18 },
        { month: 'Jun', contacts: 25, reviews: 20 }
      ];

      // Activité récente simulée
      const recentActivity = [
        { type: 'review', description: 'Nouvel avis client ajouté', timestamp: new Date().toISOString() },
        { type: 'contact', description: 'Information de contact mise à jour', timestamp: new Date(Date.now() - 3600000).toISOString() },
        { type: 'content', description: 'Section de contenu modifiée', timestamp: new Date(Date.now() - 7200000).toISOString() }
      ];

      setData({
        totalViews: 1250, // Simulé
        totalContacts: contacts.length,
        totalReviews: reviews.length,
        avgRating,
        monthlyData,
        ratingDistribution,
        recentActivity
      });
    } catch (error) {
      console.error('Erreur lors du chargement des analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, refetch: fetchAnalytics };
};
