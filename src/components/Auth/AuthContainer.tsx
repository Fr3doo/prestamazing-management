
import React from 'react';
import { useAuthContainer } from '@/hooks/useAuthContainer';
import AuthEventHandler from './AuthEventHandler';
import AuthInitializer from './AuthInitializer';

const AuthContainer = () => {
  const authProps = useAuthContainer();

  return (
    <>
      <AuthEventHandler />
      <AuthInitializer {...authProps} />
    </>
  );
};

export default AuthContainer;
