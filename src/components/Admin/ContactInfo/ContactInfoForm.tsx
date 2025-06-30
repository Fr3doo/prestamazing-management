
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useStandardToast } from '@/hooks/useStandardToast';
import ContactTypeField from './ContactTypeField';
import ContactLabelField from './ContactLabelField';
import ContactValueField from './ContactValueField';
import ContactFormActions from './ContactFormActions';

interface ContactInfo {
  id: string;
  type: string;
  value: string;
  label: string | null;
  created_at: string;
  updated_at: string;
}

interface ContactInfoFormProps {
  contact?: ContactInfo | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const ContactInfoForm = ({ contact, onSuccess, onCancel }: ContactInfoFormProps) => {
  const [formData, setFormData] = useState({
    type: '',
    value: '',
    label: '',
  });
  const [loading, setLoading] = useState(false);
  const { showSuccess, showError } = useStandardToast();

  useEffect(() => {
    if (contact) {
      setFormData({
        type: contact.type,
        value: contact.value,
        label: contact.label || '',
      });
    }
  }, [contact]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.type.trim() || !formData.value.trim()) {
      showError("Erreur", "Veuillez remplir tous les champs obligatoires");
      return;
    }

    setLoading(true);

    try {
      if (contact) {
        // Mise à jour
        const { error } = await supabase
          .from('contact_info')
          .update({
            type: formData.type.trim(),
            value: formData.value.trim(),
            label: formData.label.trim() || null,
            updated_at: new Date().toISOString(),
          })
          .eq('id', contact.id);

        if (error) throw error;
        showSuccess("Succès", "Information de contact mise à jour");
      } else {
        // Création
        const { error } = await supabase
          .from('contact_info')
          .insert({
            type: formData.type.trim(),
            value: formData.value.trim(),
            label: formData.label.trim() || null,
          });

        if (error) throw error;
        showSuccess("Succès", "Information de contact créée");
      }

      onSuccess();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      showError("Erreur", "Impossible de sauvegarder l'information de contact");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      <ContactTypeField
        value={formData.type}
        onChange={(value) => setFormData({ ...formData, type: value })}
      />

      <ContactLabelField
        value={formData.label}
        onChange={(value) => setFormData({ ...formData, label: value })}
      />

      <ContactValueField
        type={formData.type}
        value={formData.value}
        onChange={(value) => setFormData({ ...formData, value: value })}
      />

      <ContactFormActions
        loading={loading}
        isEditing={!!contact}
        onCancel={onCancel}
      />
    </form>
  );
};

export default ContactInfoForm;
