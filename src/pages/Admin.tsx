
import React from 'react';
import AdminLayout from '@/components/Admin/AdminLayout';
import AdminDashboard from '@/components/Admin/AdminDashboard';
import withAdminProtection from '@/components/Admin/withAdminProtection';

const Admin = () => {
  return (
    <AdminLayout>
      <AdminDashboard />
    </AdminLayout>
  );
};

export default withAdminProtection(Admin);
