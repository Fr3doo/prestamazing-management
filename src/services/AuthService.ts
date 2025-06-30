
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { securityMonitor } from '@/utils/securityMonitoring';
import { eventBus } from '@/services/EventBus';
import { IAuthService, SignInResult, SessionResult } from '@/interfaces/IAuthService';

export class AuthServiceImpl implements IAuthService {
  async signIn(email: string, password: string): Promise<SignInResult> {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        await securityMonitor.logLoginAttempt(false, email, error.message);
        eventBus.emit('auth:login-failed', { error: error.message });
      }
      
      return { error };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      await securityMonitor.logLoginAttempt(false, email, errorMessage);
      eventBus.emit('auth:login-failed', { error: errorMessage });
      return { error };
    }
  }

  async signOut(): Promise<void> {
    await supabase.auth.signOut();
    eventBus.emit('auth:logout');
  }

  async getSession(): Promise<SessionResult> {
    const { data: { session } } = await supabase.auth.getSession();
    return { session };
  }

  setupAuthStateListener(
    callback: (event: string, session: Session | null) => void
  ) {
    return supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state change:', event, session?.user?.id);
      
      // Log authentication events et émettre des événements
      if (event === 'SIGNED_IN' && session?.user) {
        await securityMonitor.logLoginAttempt(true, session.user.email);
        // Note: isAdmin sera déterminé plus tard par useAdminCheck
        eventBus.emit('auth:login-success', { userId: session.user.id, isAdmin: false });
      } else if (event === 'SIGNED_OUT') {
        await securityMonitor.logEvent({
          event_type: 'login_success',
          details: { action: 'logout' },
          severity: 'low'
        });
        eventBus.emit('auth:logout');
      }
      
      callback(event, session);
    });
  }
}

// Singleton instance pour compatibilité avec le code existant
export const AuthService = new AuthServiceImpl();
