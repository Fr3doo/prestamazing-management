
import React from 'react';
import { Button } from '@/components/ui/button';

interface FormActionsProps {
  loading: boolean;
  isEditing?: boolean;
  onCancel?: () => void;
  submitText?: string;
  cancelText?: string;
  submitVariant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
}

const FormActions = ({ 
  loading, 
  isEditing = false, 
  onCancel, 
  submitText,
  cancelText = "Annuler",
  submitVariant = "default"
}: FormActionsProps) => {
  const defaultSubmitText = loading 
    ? 'Sauvegarde...' 
    : isEditing 
      ? 'Mettre à jour' 
      : 'Créer';

  return (
    <div className="flex justify-end gap-2 pt-4">
      {onCancel && (
        <Button type="button" variant="outline" onClick={onCancel}>
          {cancelText}
        </Button>
      )}
      <Button type="submit" disabled={loading} variant={submitVariant}>
        {submitText || defaultSubmitText}
      </Button>
    </div>
  );
};

export default FormActions;
