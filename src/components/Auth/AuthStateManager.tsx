
import React from 'react';
import { User } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';
import LoginForm from './LoginForm';
import AccessDeniedCard from './AccessDeniedCard';

interface AuthStateManagerProps {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  onSignIn: (email: string, password: string) => Promise<void>;
  onSignOut: () => Promise<void>;
}

const AuthStateManager = ({ 
  user, 
  isAdmin, 
  loading, 
  onSignIn, 
  onSignOut 
}: AuthStateManagerProps) => {
  // Utilisateur connecté mais pas admin
  if (user && !isAdmin) {
    return (
      <AccessDeniedCard 
        userEmail={user.email || 'utilisateur'} 
        onSignOut={onSignOut} 
      />
    );
  }

  // Utilisateur non connecté
  return <LoginForm onSubmit={onSignIn} loading={loading} />;
};

export default AuthStateManager;
