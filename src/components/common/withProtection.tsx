
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import LoadingSpinner from '@/components/ui/loading-spinner';

interface ProtectionConfig {
  requireAuth?: boolean;
  requireAdmin?: boolean;
  redirectTo?: string;
  loadingComponent?: React.ComponentType;
}

const DefaultLoadingComponent = () => (
  <LoadingSpinner 
    text="Vérification des autorisations..."
    size="md"
    fullScreen={true}
  />
);

const withProtection = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  config: ProtectionConfig = {}
) => {
  const {
    requireAuth = false,
    requireAdmin = false,
    redirectTo = '/auth',
    loadingComponent: LoadingComponent = DefaultLoadingComponent
  } = config;

  const ProtectedComponent = (props: P) => {
    const { user, isAdmin, loading } = useAuth();

    if (loading) {
      return <LoadingComponent />;
    }

    // Check authentication requirement
    if (requireAuth && !user) {
      return <Navigate to={redirectTo} replace />;
    }

    // Check admin requirement
    if (requireAdmin && (!user || !isAdmin)) {
      return <Navigate to={redirectTo} replace />;
    }

    return <WrappedComponent {...props} />;
  };

  ProtectedComponent.displayName = `withProtection(${WrappedComponent.displayName || WrappedComponent.name})`;

  return ProtectedComponent;
};

export default withProtection;
