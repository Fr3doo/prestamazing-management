
import React from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useGenericForm } from '@/hooks/useGenericForm';
import { reviewValidationSchema } from '@/utils/validationRules';
import FormField from '@/components/common/FormField';
import FormActions from '@/components/common/FormActions';
import StarRating from '@/components/common/StarRating';

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
  const {
    formData,
    errors,
    loading,
    handleInputChange,
    handleSubmit,
    setFormData,
  } = useGenericForm({
    initialData: {
      name: review?.user_name || '',
      comment: review?.comment || '',
      rating: review?.rating || 5,
    },
    validationSchema: reviewValidationSchema,
    submitFunction: async (data) => {
      const submitData = {
        user_name: data.name,
        comment: data.comment,
        rating: data.rating,
      };

      if (review) {
        const { error } = await supabase
          .from('reviews')
          .update({
            ...submitData,
            updated_at: new Date().toISOString(),
          })
          .eq('id', review.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('reviews')
          .insert([submitData]);

        if (error) throw error;
      }
    },
    successTitle: "Succès",
    successMessage: review ? "Avis mis à jour avec succès" : "Avis ajouté avec succès",
    errorTitle: "Erreur",
    errorContext: "Review form submission",
    onSuccess,
  });

  const handleRatingChange = (rating: number) => {
    setFormData(prev => ({ ...prev, rating }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormField
        type="input"
        label="Nom du client"
        fieldId="name"
        value={formData.name}
        onChange={(value) => handleInputChange('name', value)}
        placeholder="Nom et prénom du client"
        required
        error={errors.name}
      />

      <StarRating
        rating={formData.rating}
        onRatingChange={handleRatingChange}
        label="Note"
        required
        fieldId="rating"
        error={errors.rating}
      />

      <FormField
        type="textarea"
        label="Commentaire"
        fieldId="comment"
        value={formData.comment}
        onChange={(value) => handleInputChange('comment', value)}
        placeholder="Témoignage du client..."
        required
        rows={4}
        error={errors.comment}
      />

      <FormActions
        loading={loading}
        isEditing={!!review}
        onCancel={onCancel}
      />
    </form>
  );
};

export default ReviewForm;
