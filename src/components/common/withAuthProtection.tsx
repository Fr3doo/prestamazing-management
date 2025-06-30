
import React from 'react';
import withProtection from './withProtection';

const withAuthProtection = <P extends object>(
  WrappedComponent: React.ComponentType<P>
) => {
  return withProtection(WrappedComponent, {
    requireAuth: true,
    requireAdmin: false,
    redirectTo: '/auth'
  });
};

export default withAuthProtection;
