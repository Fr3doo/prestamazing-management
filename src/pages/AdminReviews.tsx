
import React from 'react';
import BaseAdminPage from '@/components/Admin/BaseAdminPage';
import ReviewsManagement from '@/components/Admin/ReviewsManagement';

const AdminReviews = () => {
  return (
    <BaseAdminPage
      title="Gestion des avis"
      description="Gérez les avis clients de votre site"
      breadcrumbs={[
        { label: 'Avis clients' }
      ]}
    >
      <ReviewsManagement />
    </BaseAdminPage>
  );
};

export default AdminReviews;
