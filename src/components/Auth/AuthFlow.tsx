
import React from 'react';
import { User } from '@supabase/supabase-js';
import LoginForm from './LoginForm';
import AccessDeniedCard from './AccessDeniedCard';

interface AuthFlowProps {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  onSignIn: (email: string, password: string) => Promise<void>;
  onSignOut: () => Promise<void>;
}

const AuthFlow = ({ 
  user, 
  isAdmin, 
  loading, 
  onSignIn, 
  onSignOut 
}: AuthFlowProps) => {
  // Utilisateur connecté mais pas admin
  if (user && !isAdmin) {
    return (
      <AccessDeniedCard 
        userEmail={user.email || 'utilisateur'} 
        onSignOut={onSignOut} 
      />
    );
  }

  // Utilisateur non connecté - afficher le formulaire de connexion
  return <LoginForm onSubmit={onSignIn} loading={loading} />;
};

export default AuthFlow;
