
import { createContext, useContext } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { useServices } from '@/providers/ServiceProvider';
import { useAuthState } from './useAuthState';
import { useAuthActions } from './useAuthActions';
import { useAdminCheck } from './useAdminCheck';
import { AuthContextType } from '@/types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const services = useServices();
  
  // Use separated concerns with dependency injection
  const { user, session, initialized } = useAuthState(services.authService);
  const { signIn, signOut } = useAuthActions(services.authService);
  const { isAdmin, loading: adminLoading } = useAdminCheck(user, services.adminService);

  // Simplified context value using the new AuthContextType
  const contextValue: AuthContextType = {
    user,
    session,
    initialized,
    isAdmin,
    loading: adminLoading,
    signIn,
    signOut,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
