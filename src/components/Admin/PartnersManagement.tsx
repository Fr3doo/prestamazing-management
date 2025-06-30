
import React from 'react';
import { usePartnersManagement } from '@/hooks/usePartnersManagement';
import PartnersHeader from './Partners/PartnersHeader';
import PartnersLoading from './Partners/PartnersLoading';
import PartnersEmptyState from './Partners/PartnersEmptyState';
import PartnersList from './Partners/PartnersList';
import PartnersFormWrapper from './Partners/PartnersFormWrapper';

const PartnersManagement = () => {
  const {
    partners,
    loading,
    showForm,
    editingPartner,
    handleAdd,
    handleEdit,
    handleDelete,
    handleFormSuccess,
    handleFormCancel,
    handleDragEnd
  } = usePartnersManagement();

  if (loading) {
    return <PartnersLoading />;
  }

  if (showForm) {
    return (
      <PartnersFormWrapper
        editingPartner={editingPartner}
        onSuccess={handleFormSuccess}
        onCancel={handleFormCancel}
      />
    );
  }

  return (
    <div className="p-6">
      <PartnersHeader onAddPartner={handleAdd} />

      {partners.length === 0 ? (
        <PartnersEmptyState onAddPartner={handleAdd} />
      ) : (
        <PartnersList
          partners={partners}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onDragEnd={handleDragEnd}
        />
      )}
    </div>
  );
};

export default PartnersManagement;
