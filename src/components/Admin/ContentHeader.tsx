
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface ContentHeaderProps {
  onAddSection: () => void;
}

const ContentHeader = ({ onAddSection }: ContentHeaderProps) => {
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion du contenu</h1>
          <p className="text-gray-600">Gérez le contenu de toutes les pages du site</p>
        </div>
        <Button onClick={onAddSection}>
          <Plus className="h-4 w-4 mr-2" />
          Ajouter une section
        </Button>
      </div>
    </div>
  );
};

export default ContentHeader;
