
import React from 'react';
import ContentFormFields from './ContentFormFields';
import ContentFormActions from './ContentFormActions';
import { useContentForm } from '@/hooks/useContentForm';

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
  } = useContentForm({ section, onSuccess });

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6" noValidate>
      <ContentFormFields
        formData={formData}
        errors={errors}
        onInputChange={handleInputChange}
        isEditing={!!section}
      />
      <ContentFormActions
        loading={loading}
        isEditing={!!section}
        onCancel={onCancel}
      />
    </form>
  );
};

export default ContentForm;
