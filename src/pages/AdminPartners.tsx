
import React from 'react';
import AdminLayout from '@/components/Admin/AdminLayout';
import PartnersManagement from '@/components/Admin/PartnersManagement';
import withAdminProtection from '@/components/Admin/withAdminProtection';

const AdminPartners = () => {
  return (
    <AdminLayout>
      <PartnersManagement />
    </AdminLayout>
  );
};

export default withAdminProtection(AdminPartners);
