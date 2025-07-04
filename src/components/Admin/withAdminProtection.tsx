
import React from 'react';
import withProtection from '@/components/common/withProtection';

const withAdminProtection = <P extends object>(
  WrappedComponent: React.ComponentType<P>
) => {
  return withProtection(WrappedComponent, {
    requireAuth: true,
    requireAdmin: true,
    redirectTo: '/auth'
  });
};

export default withAdminProtection;
