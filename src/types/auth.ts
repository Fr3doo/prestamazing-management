
/**
 * Core authentication types with improved documentation
 */

import { User, Session } from '@supabase/supabase-js';

/**
 * Authentication state representing the current user session
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
 */
export interface AdminAuthState {
  /** Whether the current user has admin privileges */
  isAdmin: boolean;
  /** Whether admin status check is in progress */
  loading: boolean;
}

/**
 * Authentication actions available to components
 */
export interface AuthActions {
  /** Sign in with email and password */
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  /** Sign out the current user */
  signOut: () => Promise<void>;
}

/**
 * Complete authentication context combining state and actions
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
