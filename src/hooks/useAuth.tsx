
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

  const checkAdminStatus = async (userId: string) => {
    try {
      console.log('Checking admin status for user:', userId);
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .eq('role', 'admin')
        .single();
      
      console.log('Admin check result:', { data, error, userId });
      
      if (error && error.code !== 'PGRST116') {
        // PGRST116 is "not found" error, which is expected for non-admin users
        console.error('Error checking admin status:', error);
        await securityMonitor.logSuspiciousActivity('admin_check_failed', {
          user_id: userId,
          error: error.message
        });
        return false;
      }
      
      return !!data && !error;
    } catch (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
  };

  useEffect(() => {
    let mounted = true;

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session?.user?.id);
        
        if (!mounted) return;
        
        setSession(session);
        setUser(session?.user ?? null);
        
        // Log authentication events
        if (event === 'SIGNED_IN' && session?.user) {
          await securityMonitor.logLoginAttempt(true, session.user.email);
        } else if (event === 'SIGNED_OUT') {
          await securityMonitor.logEvent({
            event_type: 'login_success', // Using for logout too
            details: { action: 'logout' },
            severity: 'low'
          });
        }
        
        // Check admin status
        if (session?.user) {
          try {
            const adminStatus = await checkAdminStatus(session.user.id);
            console.log('Admin status for user:', session.user.id, adminStatus);
            if (mounted) {
              setIsAdmin(adminStatus);
              setLoading(false);
            }
          } catch (error) {
            console.error('Error during admin check:', error);
            if (mounted) {
              setIsAdmin(false);
              setLoading(false);
            }
          }
        } else {
          if (mounted) {
            setIsAdmin(false);
            setLoading(false);
          }
        }
      }
    );

    // Get initial session
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting initial session:', error);
          if (mounted) setLoading(false);
          return;
        }

        console.log('Initial session:', session?.user?.id);
        
        if (!mounted) return;
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          try {
            const adminStatus = await checkAdminStatus(session.user.id);
            console.log('Initial admin status:', session.user.id, adminStatus);
            if (mounted) {
              setIsAdmin(adminStatus);
            }
          } catch (error) {
            console.error('Error during initial admin check:', error);
            if (mounted) {
              setIsAdmin(false);
            }
          }
        }
        
        if (mounted) {
          setLoading(false);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    return () => {
      mounted = false;
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
