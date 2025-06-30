
import React from 'react';
import AdminLayout from '@/components/Admin/AdminLayout';
import ContentManagement from '@/components/Admin/ContentManagement';
import withAdminProtection from '@/components/Admin/withAdminProtection';

const AdminContent = () => {
  return (
    <AdminLayout>
      <ContentManagement />
    </AdminLayout>
  );
};

export default withAdminProtection(AdminContent);
