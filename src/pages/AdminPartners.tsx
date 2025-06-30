
import React from 'react';
import BaseAdminPage from '@/components/Admin/BaseAdminPage';
import PartnersManagement from '@/components/Admin/PartnersManagement';

const AdminPartners = () => {
  return (
    <BaseAdminPage
      title="Gestion des partenaires"
      description="Gérez les logos et informations de vos partenaires"
      breadcrumbs={[
        { label: 'Partenaires' }
      ]}
    >
      <PartnersManagement />
    </BaseAdminPage>
  );
};

export default AdminPartners;
