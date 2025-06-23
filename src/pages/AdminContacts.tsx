
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import AdminLayout from '@/components/Admin/AdminLayout';
import ContactManagement from '@/components/Admin/ContactManagement';

const AdminContacts = () => {
  const { user, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Chargement...</div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <AdminLayout>
      <ContactManagement />
    </AdminLayout>
  );
};

export default AdminContacts;
