
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus } from 'lucide-react';

interface PartnersEmptyStateProps {
  onAddPartner: () => void;
}

const PartnersEmptyState = ({ onAddPartner }: PartnersEmptyStateProps) => {
  return (
    <Card>
      <CardContent className="p-8 text-center">
        <p className="text-gray-500">Aucun partenaire ajouté pour le moment.</p>
        <Button onClick={onAddPartner} className="mt-4">
          <Plus className="h-4 w-4 mr-2" />
          Ajouter le premier partenaire
        </Button>
      </CardContent>
    </Card>
  );
};

export default PartnersEmptyState;
