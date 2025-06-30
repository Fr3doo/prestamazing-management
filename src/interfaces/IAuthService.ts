
import { User, Session } from '@supabase/supabase-js';

export interface SignInResult {
  error: any;
}

export interface SessionResult {
  session: Session | null;
}

export interface IAuthService {
  signIn(email: string, password: string): Promise<SignInResult>;
  signOut(): Promise<void>;
  getSession(): Promise<SessionResult>;
  setupAuthStateListener(
    callback: (event: string, session: Session | null) => void
  ): { data: { subscription: { unsubscribe: () => void } } };
}
