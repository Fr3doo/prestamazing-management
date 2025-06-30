
/**
 * Service layer interfaces for dependency injection
 */

import { User, Session } from '@supabase/supabase-js';
import { SignInResult, SessionResult } from './auth';

/**
 * Authentication service interface
 */
export interface AuthService {
  /** Authenticate user with credentials */
  signIn: (email: string, password: string) => Promise<SignInResult>;
  /** Sign out current user */
  signOut: () => Promise<void>;
  /** Get current session */
  getSession: () => Promise<SessionResult>;
  /** Set up authentication state change listener */
  setupAuthStateListener: (
    callback: (event: string, session: Session | null) => void
  ) => { data: { subscription: { unsubscribe: () => void } } };
}

/**
 * Security monitoring service interface
 */
export interface SecurityService {
  /** Log login attempt for security monitoring */
  logLoginAttempt: (success: boolean, email?: string, error?: string) => Promise<void>;
  /** Log logout event */
  logLogout: (userId?: string) => Promise<void>;
  /** Get recent security events */
  getRecentEvents: (limit?: number) => SecurityEvent[];
}

/**
 * Security event data structure
 */
export interface SecurityEvent {
  event_type: 'login_success' | 'login_failed' | 'logout';
  user_id?: string;
  details: Record<string, any>;
  timestamp: string;
}
