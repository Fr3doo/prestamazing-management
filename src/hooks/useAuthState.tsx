
import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { AuthService } from '@/services/AuthService';

export interface UseAuthStateReturn {
  user: User | null;
  session: Session | null;
  initialized: boolean;
}

export const useAuthState = (): UseAuthStateReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [initialized, setInitialized] = useState(false);

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

  return {
    user,
    session,
    initialized,
  };
};
