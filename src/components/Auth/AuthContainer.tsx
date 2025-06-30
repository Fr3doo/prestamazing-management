
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useAuthNavigation } from '@/hooks/useAuthNavigation';
import { useToast } from '@/hooks/use-toast';
import AuthEventHandler from './AuthEventHandler';
import AuthLoadingScreen from './AuthLoadingScreen';
import AuthStateManager from './AuthStateManager';

const AuthContainer = () => {
  const { signIn, signOut, user, isAdmin, initialized, loading } = useAuth();
  const { toast } = useToast();

  // Gestion de la navigation via le hook dédié
  useAuthNavigation({ user, isAdmin, initialized });

  const handleSignIn = async (email: string, password: string) => {
    try {
      const { error } = await signIn(email, password);
      
      if (error) {
        // L'événement d'erreur sera émis par AuthService
        console.log('Login error handled by event system');
      }
    } catch (error) {
      toast({
        title: "Erreur de connexion",
        description: "Une erreur inattendue s'est produite",
        variant: "destructive",
      });
    }
  };

  const handleSignOut = async () => {
    await signOut();
    // L'événement de déconnexion sera émis par AuthService
  };

  // Affichage du loading pendant l'initialisation
  if (!initialized) {
    return <AuthLoadingScreen />;
  }

  return (
    <>
      <AuthEventHandler />
      <AuthStateManager
        user={user}
        isAdmin={isAdmin}
        loading={loading}
        onSignIn={handleSignIn}
        onSignOut={handleSignOut}
      />
    </>
  );
};

export default AuthContainer;
