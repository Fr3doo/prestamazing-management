
import React from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useGenericForm } from '@/hooks/useGenericForm';
import { contentSectionSchema } from '@/utils/validationRules';
import FormField from '@/components/common/FormField';
import FormActions from '@/components/common/FormActions';

interface ContentSection {
  id: string;
  section_key: string;
  title: string | null;
  content: string | null;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

interface ContentFormProps {
  section?: ContentSection | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const ContentForm = ({ section, onSuccess, onCancel }: ContentFormProps) => {
  const {
    formData,
    errors,
    loading,
    handleInputChange,
    handleSubmit,
  } = useGenericForm({
    initialData: {
      section_key: section?.section_key || '',
      title: section?.title || '',
      content: section?.content || '',
      image_url: section?.image_url || '',
    },
    validationSchema: contentSectionSchema,
    submitFunction: async (data) => {
      const submitData = {
        section_key: data.section_key,
        title: data.title || null,
        content: data.content || null,
        image_url: data.image_url || null,
      };

      if (section) {
        const { error } = await supabase
          .from('content_sections')
          .update({
            ...submitData,
            updated_at: new Date().toISOString(),
          })
          .eq('id', section.id);

        if (error) throw error;
        console.log('Content section updated:', submitData.section_key);
      } else {
        const { error } = await supabase
          .from('content_sections')
          .insert([submitData]);

        if (error) throw error;
        console.log('Content section created:', submitData.section_key);
      }
    },
    successTitle: "Succès",
    successMessage: section ? "Section mise à jour avec succès" : "Section créée avec succès",
    errorTitle: "Erreur",
    errorContext: "Content form submission",
    onSuccess,
  });

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6" noValidate>
      <FormField
        type="input"
        label="Clé de section"
        fieldId="section_key"
        value={formData.section_key}
        onChange={(value) => handleInputChange('section_key', value)}
        placeholder="ex: hero_title"
        required
        maxLength={50}
        disabled={!!section}
        error={errors.section_key}
        help="Identifiant unique technique (ne pas modifier pour les sections existantes)"
      />

      <FormField
        type="input"
        label="Titre"
        fieldId="title"
        value={formData.title}
        onChange={(value) => handleInputChange('title', value)}
        placeholder="Titre de la section"
        maxLength={200}
        error={errors.title}
      />

      <FormField
        type="textarea"
        label="Contenu"
        fieldId="content"
        value={formData.content}
        onChange={(value) => handleInputChange('content', value)}
        placeholder="Contenu de la section"
        rows={6}
        maxLength={5000}
        error={errors.content}
        showCharCount
      />

      <FormField
        type="input"
        inputType="url"
        label="URL de l'image"
        fieldId="image_url"
        value={formData.image_url}
        onChange={(value) => handleInputChange('image_url', value)}
        placeholder="https://example.com/image.jpg"
        maxLength={500}
        error={errors.image_url}
      />

      <FormActions
        loading={loading}
        isEditing={!!section}
        onCancel={onCancel}
      />
    </form>
  );
};

export default ContentForm;
