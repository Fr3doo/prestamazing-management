
import { createContext, useContext } from 'react';
import { User, Session } from '@supabase/supabase-js';
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
  // Utilisation des hooks séparés
  const { user, session, initialized } = useAuthState();
  const { signIn, signOut } = useAuthActions();
  const { isAdmin, loading: adminLoading } = useAdminCheck(user);

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
