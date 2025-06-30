
import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { AuthService } from '@/types/services';
import { AuthState } from '@/types/auth';

export const useAuthState = (authService: AuthService): AuthState => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    let isMounted = true;

    // Set up auth state listener using injected AuthService
    const { data: { subscription } } = authService.setupAuthStateListener(
      (event, session) => {
        if (!isMounted) return;

        setSession(session);
        setUser(session?.user ?? null);
        
        if (isMounted) {
          setInitialized(true);
        }
      }
    );

    // Get initial session using injected AuthService
    const initializeAuth = async () => {
      try {
        const { session } = await authService.getSession();
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
  }, [authService]);

  return {
    user,
    session,
    initialized,
  };
};
