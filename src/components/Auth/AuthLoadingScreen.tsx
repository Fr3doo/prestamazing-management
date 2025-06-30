
import React from 'react';
import LoadingSpinner from '@/components/ui/loading-spinner';

const AuthLoadingScreen = () => {
  return (
    <LoadingSpinner 
      text="Initialisation de l'authentification..."
      size="md"
      fullScreen={true}
    />
  );
};

export default AuthLoadingScreen;
