
import React from 'react';
import { supabase } from '@/integrations/supabase/client';
import { contactInfoValidationSchema } from '@/utils/validationRules';
import GenericForm from '@/components/common/GenericForm';
import { contactTypes } from './contactTypes';

interface ContactInfo {
  id: string;
  type: string;
  value: string;
  label: string | null;
  created_at: string;
  updated_at: string;
}

interface OptimizedContactInfoFormProps {
  contact?: ContactInfo | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const OptimizedContactInfoForm = ({ contact, onSuccess, onCancel }: OptimizedContactInfoFormProps) => {
  const formFields = [
    {
      key: 'type' as const,
      type: 'select' as const,
      label: 'Type de contact',
      required: true,
      options: contactTypes.map(type => ({ value: type.value, label: type.label }))
    },
    {
      key: 'label' as const,
      type: 'input' as const,
      label: 'Libellé',
      placeholder: 'ex: Téléphone principal, Email support...'
    }
  ];

  const renderCustomFields = (formData: any, handleInputChange: any) => {
    const isMultiLine = formData.type === 'hours' || formData.type === 'address' || formData.type === 'zone';
    
    return (
      <div>
        <label htmlFor="value" className="block text-sm font-medium mb-2">
          Valeur *
        </label>
        {isMultiLine ? (
          <textarea
            id="value"
            value={formData.value || ''}
            onChange={(e) => handleInputChange('value', e.target.value)}
            placeholder={getPlaceholder(formData.type)}
            rows={4}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        ) : (
          <input
            id="value"
            value={formData.value || ''}
            onChange={(e) => handleInputChange('value', e.target.value)}
            placeholder={getPlaceholder(formData.type)}
            type={getInputType(formData.type)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        )}
      </div>
    );
  };

  const getPlaceholder = (type: string) => {
    switch (type) {
      case 'phone':
      case 'whatsapp':
        return "+33 6 00 00 00 00";
      case 'email':
        return "contact@example.com";
      case 'website':
        return "https://www.example.com";
      case 'hours':
        return "Lundi - Vendredi: 9h00 - 19h00\nSamedi: Sur rendez-vous";
      case 'address':
        return "123 Rue de la Restauration\n75001 Paris, France";
      case 'zone':
        return "Paris et région parisienne\nDéplacements possibles dans toute la France";
      default:
        return "Valeur de l'information de contact";
    }
  };

  const getInputType = (type: string) => {
    if (type === 'email') return 'email';
    if (type === 'website') return 'url';
    return 'text';
  };

  return (
    <GenericForm
      config={{
        initialData: {
          type: contact?.type || '',
          value: contact?.value || '',
          label: contact?.label || '',
        },
        validationSchema: contactInfoValidationSchema,
        submitFunction: async (data) => {
          const submitData = {
            type: data.type.trim(),
            value: data.value.trim(),
            label: data.label.trim() || null,
          };

          if (contact) {
            const { error } = await supabase
              .from('contact_info')
              .update({
                ...submitData,
                updated_at: new Date().toISOString(),
              })
              .eq('id', contact.id);

            if (error) throw error;
          } else {
            const { error } = await supabase
              .from('contact_info')
              .insert([submitData]);

            if (error) throw error;
          }
        },
        successTitle: "Succès",
        successMessage: contact ? "Information de contact mise à jour" : "Information de contact créée",
        errorTitle: "Erreur",
        errorContext: "Contact info form submission",
        onSuccess,
      }}
      fields={formFields}
      renderCustomFields={renderCustomFields}
      onCancel={onCancel}
      isEditing={!!contact}
      className="max-w-2xl space-y-6"
    />
  );
};

export default OptimizedContactInfoForm;
