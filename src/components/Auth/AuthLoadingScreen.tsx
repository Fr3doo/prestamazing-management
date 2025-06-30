
import React from 'react';

const AuthLoadingScreen = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p className="mt-2 text-gray-600">Chargement...</p>
      </div>
    </div>
  );
};

export default AuthLoadingScreen;
