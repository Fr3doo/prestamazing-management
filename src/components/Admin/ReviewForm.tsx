
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Star } from 'lucide-react';

interface Review {
  id: string;
  user_name: string;
  comment: string;
  rating: number;
  created_at: string;
  updated_at: string;
}

interface ReviewFormProps {
  review?: Review | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const ReviewForm = ({ review, onSuccess, onCancel }: ReviewFormProps) => {
  const [formData, setFormData] = useState({
    user_name: '',
    comment: '',
    rating: 5,
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (review) {
      setFormData({
        user_name: review.user_name,
        comment: review.comment,
        rating: review.rating,
      });
    }
  }, [review]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (review) {
        // Mise à jour
        const { error } = await supabase
          .from('reviews')
          .update({
            user_name: formData.user_name,
            comment: formData.comment,
            rating: formData.rating,
            updated_at: new Date().toISOString(),
          })
          .eq('id', review.id);

        if (error) throw error;

        toast({
          title: "Succès",
          description: "Avis mis à jour avec succès",
        });
      } else {
        // Création
        const { error } = await supabase
          .from('reviews')
          .insert({
            user_name: formData.user_name,
            comment: formData.comment,
            rating: formData.rating,
          });

        if (error) throw error;

        toast({
          title: "Succès",
          description: "Avis ajouté avec succès",
        });
      }

      onSuccess();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder l'avis",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRatingClick = (rating: number) => {
    setFormData({ ...formData, rating });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="user_name">Nom du client</Label>
        <Input
          id="user_name"
          value={formData.user_name}
          onChange={(e) => setFormData({ ...formData, user_name: e.target.value })}
          required
          placeholder="Nom et prénom du client"
        />
      </div>

      <div>
        <Label>Note</Label>
        <div className="flex gap-1 mt-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => handleRatingClick(star)}
              className="text-2xl hover:scale-110 transition-transform"
            >
              <Star
                className={`h-6 w-6 ${
                  star <= formData.rating
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300'
                }`}
              />
            </button>
          ))}
          <span className="ml-2 text-sm text-gray-600">
            {formData.rating}/5 étoiles
          </span>
        </div>
      </div>

      <div>
        <Label htmlFor="comment">Commentaire</Label>
        <Textarea
          id="comment"
          value={formData.comment}
          onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
          required
          placeholder="Témoignage du client..."
          rows={4}
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Sauvegarde...' : (review ? 'Mettre à jour' : 'Ajouter')}
        </Button>
      </div>
    </form>
  );
};

export default ReviewForm;
