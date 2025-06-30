
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { securityMonitor } from '@/utils/securityMonitoring';

interface SignInResult {
  error: any;
}

export class AuthService {
  static async signIn(email: string, password: string): Promise<SignInResult> {
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
  }

  static async signOut(): Promise<void> {
    await supabase.auth.signOut();
  }

  static async getSession(): Promise<{ session: Session | null }> {
    const { data: { session } } = await supabase.auth.getSession();
    return { session };
  }

  static setupAuthStateListener(
    callback: (event: string, session: Session | null) => void
  ) {
    return supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state change:', event, session?.user?.id);
      
      // Log authentication events
      if (event === 'SIGNED_IN' && session?.user) {
        await securityMonitor.logLoginAttempt(true, session.user.email);
      } else if (event === 'SIGNED_OUT') {
        await securityMonitor.logEvent({
          event_type: 'login_success',
          details: { action: 'logout' },
          severity: 'low'
        });
      }
      
      callback(event, session);
    });
  }
}
