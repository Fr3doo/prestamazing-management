
import React from 'react';
import { Button } from '@/components/ui/button';

interface ContactFormActionsProps {
  loading: boolean;
  isEditing: boolean;
  onCancel: () => void;
}

const ContactFormActions = ({ loading, isEditing, onCancel }: ContactFormActionsProps) => {
  return (
    <div className="flex justify-end gap-2 pt-4">
      <Button type="button" variant="outline" onClick={onCancel}>
        Annuler
      </Button>
      <Button type="submit" disabled={loading}>
        {loading ? 'Sauvegarde...' : (isEditing ? 'Mettre à jour' : 'Créer')}
      </Button>
    </div>
  );
};

export default ContactFormActions;
