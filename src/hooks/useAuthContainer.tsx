
import { useAuth } from '@/hooks/useAuth';
import { useAuthNavigation } from '@/hooks/useAuthNavigation';

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

  // Gestion de la navigation
  useAuthNavigation({ user, isAdmin, initialized });

  const handleSignIn = async (email: string, password: string) => {
    try {
      const { error } = await signIn(email, password);
      
      if (error) {
        console.log('Login error handled by event system');
      }
    } catch (error) {
      console.error('Unexpected sign in error:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
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
