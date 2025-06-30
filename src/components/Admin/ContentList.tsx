
import React from 'react';
import ContentSectionCard from './ContentSectionCard';

interface ContentSection {
  id: string;
  section_key: string;
  title: string | null;
  content: string | null;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

interface ContentListProps {
  sections: ContentSection[];
  onEditSection: (section: ContentSection) => void;
}

const ContentList = ({ sections, onEditSection }: ContentListProps) => {
  if (sections.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Aucune section trouvée</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {sections.map((section) => (
        <ContentSectionCard
          key={section.id}
          section={section}
          onEdit={onEditSection}
        />
      ))}
    </div>
  );
};

export default ContentList;
