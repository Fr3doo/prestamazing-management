
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface ContentHeaderProps {
  onAddSection: () => void;
}

const ContentHeader = ({ onAddSection }: ContentHeaderProps) => {
  return (
    <div className="mb-6 flex justify-end">
      <Button onClick={onAddSection}>
        <Plus className="h-4 w-4 mr-2" />
        Ajouter une section
      </Button>
    </div>
  );
};

export default ContentHeader;
