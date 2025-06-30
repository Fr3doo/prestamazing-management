
/**
 * Core authentication types with improved documentation and ISP compliance
 */

import { User, Session } from '@supabase/supabase-js';

/**
 * Authentication state representing the current user session
 * Focused on read-only state data
 */
export interface AuthState {
  /** Current authenticated user, null if not authenticated */
  user: User | null;
  /** Current session data, null if no active session */
  session: Session | null;
  /** Whether the authentication system has been initialized */
  initialized: boolean;
}

/**
 * Admin-specific authentication state
 * Separated from general auth state for better segregation
 */
export interface AdminAuthState {
  /** Whether the current user has admin privileges */
  isAdmin: boolean;
  /** Whether admin status check is in progress */
  loading: boolean;
}

/**
 * Authentication actions available to components
 * Focused only on actions, not state
 */
export interface AuthActions {
  /** Sign in with email and password */
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  /** Sign out the current user */
  signOut: () => Promise<void>;
}

/**
 * Complete authentication context combining state and actions
 * Composition of specialized interfaces following ISP
 */
export interface AuthContextType extends AuthState, AdminAuthState, AuthActions {}

/**
 * Result type for sign-in operations
 */
export interface SignInResult {
  /** Error object if sign-in failed, null if successful */
  error: any;
}

/**
 * Result type for session retrieval operations
 */
export interface SessionResult {
  /** Session data if available, null otherwise */
  session: Session | null;
}

/**
 * Authentication lifecycle events for monitoring
 */
export interface AuthEvents {
  'auth:login-success': { userId: string; isAdmin: boolean };
  'auth:login-failed': { error: string };
  'auth:logout': undefined;
}
