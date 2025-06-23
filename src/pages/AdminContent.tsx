
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import AdminLayout from '@/components/Admin/AdminLayout';
import ContentManagement from '@/components/Admin/ContentManagement';

const AdminContent = () => {
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
      <ContentManagement />
    </AdminLayout>
  );
};

export default AdminContent;
