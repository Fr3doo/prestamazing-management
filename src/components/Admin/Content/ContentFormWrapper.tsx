
import React from 'react';
import ContentForm from '../ContentForm';

interface ContentSection {
  id: string;
  section_key: string;
  title: string | null;
  content: string | null;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

interface ContentFormWrapperProps {
  editingSection: ContentSection | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const ContentFormWrapper = ({ editingSection, onSuccess, onCancel }: ContentFormWrapperProps) => {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          {editingSection ? 'Modifier la section' : 'Ajouter une section'}
        </h2>
      </div>
      <ContentForm
        section={editingSection}
        onSuccess={onSuccess}
        onCancel={onCancel}
      />
    </div>
  );
};

export default ContentFormWrapper;
