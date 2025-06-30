
import React from 'react';
import AdminLayout from '@/components/Admin/AdminLayout';
import ReviewsManagement from '@/components/Admin/ReviewsManagement';
import withAdminProtection from '@/components/Admin/withAdminProtection';

const AdminReviews = () => {
  return (
    <AdminLayout>
      <ReviewsManagement />
    </AdminLayout>
  );
};

export default withAdminProtection(AdminReviews);
