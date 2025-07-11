
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
        console.warn('Login attempt failed:', { email: this.maskEmail(email), error: error.message });
      }
      
      return { error };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      await securityMonitor.logLoginAttempt(false, email, errorMessage);
      eventBus.emit('auth:login-failed', { error: errorMessage });
      console.error('Login error:', { email: this.maskEmail(email), error: errorMessage });
      return { error };
    }
  }

  async signOut(): Promise<void> {
    try {
      // Déconnexion immédiate
      await supabase.auth.signOut();
      // Logging en arrière-plan (sans await)
      securityMonitor.logLogout();
      eventBus.emit('auth:logout', undefined);
      console.log('User signed out successfully');
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  }
  
  async getSession(): Promise<SessionResult> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      return { session };
    } catch (error) {
      console.error('Get session error:', error);
      return { session: null };
    }
  }

  setupAuthStateListener(
    callback: (event: string, session: Session | null) => void
  ) {
    return supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state change:', event, session?.user?.id);
      
      try {
        if (event === 'SIGNED_IN' && session?.user) {
          await securityMonitor.logLoginAttempt(true, session.user.email);
          eventBus.emit('auth:login-success', { userId: session.user.id, isAdmin: false });
        } else if (event === 'SIGNED_OUT') {
          await securityMonitor.logLogout(session?.user?.id);
          eventBus.emit('auth:logout', undefined);
        }
      } catch (error) {
        console.error('Auth state listener error:', error);
      }
      
      callback(event, session);
    });
  }

  private maskEmail(email?: string): string {
    if (!email) return 'unknown';
    const parts = email.split('@');
    if (parts.length === 2) {
      const username = parts[0].length > 2 ? parts[0].substring(0, 2) + '***' : '***';
      return `${username}@${parts[1]}`;
    }
    return '***@***';
  }
}

// Singleton instance pour compatibilité avec le code existant
export const AuthService = new AuthServiceImpl();
