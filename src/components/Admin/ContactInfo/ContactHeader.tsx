
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface ContactHeaderProps {
  onAddContact: () => void;
}

const ContactHeader = ({ onAddContact }: ContactHeaderProps) => {
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des contacts</h1>
          <p className="text-gray-600">Gérez les informations de contact, horaires et zones d'intervention</p>
        </div>
        <Button onClick={onAddContact}>
          <Plus className="h-4 w-4 mr-2" />
          Ajouter un contact
        </Button>
      </div>
    </div>
  );
};

export default ContactHeader;
