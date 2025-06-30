
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface PartnersHeaderProps {
  onAddPartner: () => void;
}

const PartnersHeader = ({ onAddPartner }: PartnersHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Gestion des partenaires</h1>
        <p className="text-gray-600">Gérez les logos et informations de vos partenaires</p>
      </div>
      <Button onClick={onAddPartner}>
        <Plus className="h-4 w-4 mr-2" />
        Ajouter un partenaire
      </Button>
    </div>
  );
};

export default PartnersHeader;
