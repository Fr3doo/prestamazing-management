
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

export interface UseAuthContainerReturn {
  user: any;
  isAdmin: boolean;
  initialized: boolean;
  loading: boolean;
  handleSignIn: (email: string, password: string) => Promise<void>;
  handleSignOut: () => Promise<void>;
}

export const useAuthContainer = (): UseAuthContainerReturn => {
  const { signIn, signOut, user, isAdmin, initialized, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Navigation directe basée sur l'état auth
  useEffect(() => {
    if (initialized && user && isAdmin) {
      navigate('/admin', { replace: true });
    }
  }, [initialized, user, isAdmin, navigate]);

  const handleSignIn = async (email: string, password: string) => {
    try {
      const { error } = await signIn(email, password);
      
      if (error) {
        console.error('Login error:', error);
        // Plus besoin d'événements, l'erreur sera gérée par le toast dans AuthEventHandler
      }
    } catch (error) {
      console.error('Unexpected sign in error:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      // Navigation directe après déconnexion
      navigate('/auth', { replace: true });
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return {
    user,
    isAdmin,
    initialized,
    loading,
    handleSignIn,
    handleSignOut,
  };
};
