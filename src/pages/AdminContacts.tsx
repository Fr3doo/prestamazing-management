
import React from 'react';
import BaseAdminPage from '@/components/Admin/BaseAdminPage';
import ContactManagement from '@/components/Admin/ContactManagement';

const AdminContacts = () => {
  return (
    <BaseAdminPage
      title="Gestion des contacts"
      description="Gérez les informations de contact affichées sur le site"
      breadcrumbs={[
        { label: 'Contacts' }
      ]}
    >
      <ContactManagement />
    </BaseAdminPage>
  );
};

export default AdminContacts;
