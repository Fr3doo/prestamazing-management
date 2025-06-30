
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';

interface ContentSection {
  id: string;
  section_key: string;
  title: string | null;
  content: string | null;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

interface ContentSectionCardProps {
  section: ContentSection;
  onEdit: (section: ContentSection) => void;
}

const ContentSectionCard = ({ section, onEdit }: ContentSectionCardProps) => {
  const truncateText = (text: string | null, maxLength: number = 100) => {
    if (!text) return '-';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <CardTitle className="text-lg">{section.title || section.section_key}</CardTitle>
              <Badge variant="outline">
                {section.section_key}
              </Badge>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(section)}
            >
              <Edit className="h-4 w-4 mr-1" />
              Modifier
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="bg-gray-50 p-3 rounded-md">
          <p className="text-sm font-medium text-gray-700 mb-1">Contenu actuel:</p>
          <p className="text-sm text-gray-600">
            {truncateText(section.content)}
          </p>
          {section.image_url && (
            <div className="mt-2">
              <p className="text-sm font-medium text-gray-700 mb-1">Image:</p>
              <p className="text-sm text-gray-600">{section.image_url}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ContentSectionCard;
