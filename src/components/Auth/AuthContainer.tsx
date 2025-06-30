
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useAuthNavigation } from '@/hooks/useAuthNavigation';
import { useToast } from '@/hooks/use-toast';
import LoginForm from './LoginForm';
import AccessDeniedCard from './AccessDeniedCard';

const AuthContainer = () => {
  const { signIn, signOut, user, isAdmin, initialized, loading } = useAuth();
  const { toast } = useToast();

  // Gestion de la navigation via le hook dédié
  useAuthNavigation({ user, isAdmin, initialized });

  const handleSignIn = async (email: string, password: string) => {
    try {
      const { error } = await signIn(email, password);
      
      if (error) {
        toast({
          title: "Erreur de connexion",
          description: error.message,
          variant: "destructive",
        });
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
    toast({
      title: "Déconnexion réussie",
      description: "Vous pouvez maintenant vous connecter avec un autre compte.",
    });
  };

  // Affichage du loading pendant l'initialisation
  if (!initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  // Utilisateur connecté mais pas admin
  if (user && !isAdmin) {
    return (
      <AccessDeniedCard 
        userEmail={user.email || 'utilisateur'} 
        onSignOut={handleSignOut} 
      />
    );
  }

  // Utilisateur non connecté
  return <LoginForm onSubmit={handleSignIn} loading={loading} />;
};

export default AuthContainer;
