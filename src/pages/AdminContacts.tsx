
import React from 'react';
import AdminLayout from '@/components/Admin/AdminLayout';
import ContactManagement from '@/components/Admin/ContactManagement';
import withAdminProtection from '@/components/Admin/withAdminProtection';

const AdminContacts = () => {
  return (
    <AdminLayout>
      <ContactManagement />
    </AdminLayout>
  );
};

export default withAdminProtection(AdminContacts);
