
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface WithAdminProtectionProps {
  children: React.ReactNode;
}

const AdminLoadingPage = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-lg">Chargement...</div>
  </div>
);

const withAdminProtection = <P extends object>(
  WrappedComponent: React.ComponentType<P>
) => {
  const ProtectedComponent = (props: P) => {
    const { user, isAdmin, loading } = useAuth();

    if (loading) {
      return <AdminLoadingPage />;
    }

    if (!user || !isAdmin) {
      return <Navigate to="/auth" replace />;
    }

    return <WrappedComponent {...props} />;
  };

  ProtectedComponent.displayName = `withAdminProtection(${WrappedComponent.displayName || WrappedComponent.name})`;

  return ProtectedComponent;
};

export default withAdminProtection;
