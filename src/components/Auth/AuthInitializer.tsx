
import React from 'react';
import AuthLoadingScreen from './AuthLoadingScreen';
import AuthFlow from './AuthFlow';
import { UseAuthContainerReturn } from '@/hooks/useAuthContainer';

interface AuthInitializerProps extends UseAuthContainerReturn {}

const AuthInitializer = ({ 
  user, 
  isAdmin, 
  initialized, 
  loading, 
  handleSignIn, 
  handleSignOut 
}: AuthInitializerProps) => {
  // Affichage du loading pendant l'initialisation OU tant que le check admin n'est pas terminé
  if (!initialized || loading) {
    return <AuthLoadingScreen />;
  }

  return (
    <AuthFlow
      user={user}
      isAdmin={isAdmin}
      loading={loading}
      onSignIn={handleSignIn}
      onSignOut={handleSignOut}
    />
  );
};

export default AuthInitializer;
