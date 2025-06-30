
import { createContext, useContext } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { useServices } from '@/providers/ServiceProvider';
import { useAuthState } from './useAuthState';
import { useAuthActions } from './useAuthActions';
import { useAdminCheck } from './useAdminCheck';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  loading: boolean;
  initialized: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const services = useServices();
  
  // Utilisation des hooks séparés avec injection de services
  const { user, session, initialized } = useAuthState(services.authService);
  const { signIn, signOut } = useAuthActions(services.authService);
  const { isAdmin, loading: adminLoading } = useAdminCheck(user, services.adminService);

  // Combine auth loading with admin loading for backward compatibility
  const loading = adminLoading;

  return (
    <AuthContext.Provider value={{
      user,
      session,
      isAdmin,
      loading,
      initialized,
      signIn,
      signOut,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
