
import { useState, useEffect, createContext, useContext } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { AuthService } from '@/services/AuthService';
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
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [initialized, setInitialized] = useState(false);

  // Use the separated admin check hook
  const { isAdmin, loading: adminLoading } = useAdminCheck(user);

  useEffect(() => {
    let isMounted = true;

    // Set up auth state listener using AuthService
    const { data: { subscription } } = AuthService.setupAuthStateListener(
      (event, session) => {
        if (!isMounted) return;

        setSession(session);
        setUser(session?.user ?? null);
        
        if (isMounted) {
          setInitialized(true);
        }
      }
    );

    // Get initial session using AuthService
    const initializeAuth = async () => {
      try {
        const { session } = await AuthService.getSession();
        console.log('Initial session:', session?.user?.id);
        
        if (!isMounted) return;
        
        setSession(session);
        setUser(session?.user ?? null);
      } catch (error) {
        console.error('Error during auth initialization:', error);
      } finally {
        if (isMounted) {
          setInitialized(true);
        }
      }
    };

    initializeAuth();

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    return await AuthService.signIn(email, password);
  };

  const signOut = async () => {
    await AuthService.signOut();
  };

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
