
import { useState, useEffect, createContext, useContext } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { securityMonitor } from '@/utils/securityMonitoring';

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
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);

  const checkAdminStatus = async (userId: string): Promise<boolean> => {
    try {
      console.log('Checking admin status for user:', userId);
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .eq('role', 'admin')
        .maybeSingle();
      
      console.log('Admin check result:', { data, error, userId });
      
      if (error) {
        console.error('Error checking admin status:', error);
        return false;
      }
      
      return !!data;
    } catch (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
  };

  useEffect(() => {
    let isMounted = true;

    const initAuth = async () => {
      try {
        console.log('Starting auth initialization');
        
        // Get initial session
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting initial session:', error);
        }

        console.log('Initial session retrieved:', !!initialSession);
        
        if (isMounted) {
          setSession(initialSession);
          setUser(initialSession?.user ?? null);
          
          if (initialSession?.user) {
            try {
              const adminStatus = await checkAdminStatus(initialSession.user.id);
              console.log('Initial admin status:', adminStatus);
              if (isMounted) {
                setIsAdmin(adminStatus);
              }
            } catch (error) {
              console.error('Error during initial admin check:', error);
              if (isMounted) {
                setIsAdmin(false);
              }
            }
          } else {
            setIsAdmin(false);
          }
          
          // Always set initialized to true after processing
          setInitialized(true);
          console.log('Auth initialization completed');
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        if (isMounted) {
          setUser(null);
          setSession(null);
          setIsAdmin(false);
          setInitialized(true); // Set to true even on error
        }
      }
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log('Auth state change:', event, !!newSession);
        
        if (!isMounted) return;
        
        setSession(newSession);
        setUser(newSession?.user ?? null);
        
        if (event === 'SIGNED_IN' && newSession?.user) {
          try {
            await securityMonitor.logLoginAttempt(true, newSession.user.email);
            const adminStatus = await checkAdminStatus(newSession.user.id);
            console.log('Admin status after sign in:', adminStatus);
            if (isMounted) {
              setIsAdmin(adminStatus);
            }
          } catch (error) {
            console.error('Error handling sign in:', error);
            if (isMounted) {
              setIsAdmin(false);
            }
          }
        } else if (event === 'SIGNED_OUT') {
          try {
            await securityMonitor.logEvent({
              event_type: 'login_success',
              details: { action: 'logout' },
              severity: 'low'
            });
          } catch (error) {
            console.error('Error logging sign out:', error);
          }
          if (isMounted) {
            setIsAdmin(false);
          }
        } else if (!newSession) {
          if (isMounted) {
            setIsAdmin(false);
          }
        }
        
        // Ensure initialization is complete
        if (isMounted && !initialized) {
          setInitialized(true);
        }
      }
    );

    // Initialize auth
    initAuth();

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        await securityMonitor.logLoginAttempt(false, email, error.message);
      }
      
      return { error };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      await securityMonitor.logLoginAttempt(false, email, errorMessage);
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

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
