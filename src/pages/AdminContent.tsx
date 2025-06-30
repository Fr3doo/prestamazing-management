
import React from 'react';
import BaseAdminPage from '@/components/Admin/BaseAdminPage';
import ContentManagement from '@/components/Admin/ContentManagement';

const AdminContent = () => {
  return (
    <BaseAdminPage
      title="Gestion du contenu"
      description="Gérez le contenu de toutes les pages du site"
      breadcrumbs={[
        { label: 'Contenu' }
      ]}
    >
      <ContentManagement />
    </BaseAdminPage>
  );
};

export default AdminContent;
