
import React from 'react';
import PartnerForm from '../PartnerForm';
import { Partner } from '@/hooks/usePartnersManagement';

interface PartnersFormWrapperProps {
  editingPartner: Partner | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const PartnersFormWrapper = ({ editingPartner, onSuccess, onCancel }: PartnersFormWrapperProps) => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {editingPartner ? 'Modifier le partenaire' : 'Ajouter un partenaire'}
        </h1>
      </div>
      <PartnerForm
        partner={editingPartner}
        onSuccess={onSuccess}
        onCancel={onCancel}
      />
    </div>
  );
};

export default PartnersFormWrapper;
