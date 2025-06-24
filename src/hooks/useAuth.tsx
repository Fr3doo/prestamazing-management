
import { useState, useEffect, createContext, useContext } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { securityMonitor } from '@/utils/securityMonitoring';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

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
        
        // Get initial session with timeout
        const sessionPromise = supabase.auth.getSession();
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Session timeout')), 10000)
        );
        
        const { data: { session: initialSession }, error } = await Promise.race([
          sessionPromise,
          timeoutPromise
        ]) as any;
        
        if (error) {
          console.error('Error getting initial session:', error);
          if (isMounted) {
            setUser(null);
            setSession(null);
            setIsAdmin(false);
            setLoading(false);
          }
          return;
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
          
          setLoading(false);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        if (isMounted) {
          setUser(null);
          setSession(null);
          setIsAdmin(false);
          setLoading(false);
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
        
        // Always set loading to false after auth state change
        if (isMounted) {
          setLoading(false);
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
