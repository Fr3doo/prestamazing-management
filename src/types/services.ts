
/**
 * Service layer interfaces with ISP compliance and domain segregation
 */

import { User, Session } from '@supabase/supabase-js';
import { SignInResult, SessionResult } from './auth';

/**
 * Core authentication operations
 * Focused only on authentication actions
 */
export interface AuthenticationService {
  /** Authenticate user with credentials */
  signIn: (email: string, password: string) => Promise<SignInResult>;
  /** Sign out current user */
  signOut: () => Promise<void>;
  /** Get current session */
  getSession: () => Promise<SessionResult>;
}

/**
 * Authentication state management
 * Separated from authentication actions
 */
export interface AuthStateService {
  /** Set up authentication state change listener */
  setupAuthStateListener: (
    callback: (event: string, session: Session | null) => void
  ) => { data: { subscription: { unsubscribe: () => void } } };
}

/**
 * Complete authentication service combining operations and state management
 */
export interface AuthService extends AuthenticationService, AuthStateService {}

/**
 * Admin privilege management
 * Focused only on admin-related operations
 */
export interface AdminPrivilegeService {
  /** Check if a user has admin privileges */
  checkAdminStatus: (userId: string) => Promise<boolean>;
}

/**
 * Admin activity logging
 * Separated from privilege checking
 */
export interface AdminAuditService {
  /** Log admin access attempt for security monitoring */
  logAdminAccess: (userId: string, adminStatus: boolean) => Promise<void>;
}

/**
 * Complete admin service combining privilege and audit capabilities
 */
export interface AdminService extends AdminPrivilegeService, AdminAuditService {}

/**
 * Security event logging
 * Focused on security monitoring operations
 */
export interface SecurityMonitoringService {
  /** Log login attempt for security monitoring */
  logLoginAttempt: (success: boolean, email?: string, error?: string) => Promise<void>;
  /** Log logout event */
  logLogout: (userId?: string) => Promise<void>;
}

/**
 * Security event retrieval
 * Separated from logging operations
 */
export interface SecurityReportingService {
  /** Get recent security events */
  getRecentEvents: (limit?: number) => SecurityEvent[];
}

/**
 * Complete security service combining monitoring and reporting
 */
export interface SecurityService extends SecurityMonitoringService, SecurityReportingService {}

/**
 * Security event data structure
 */
export interface SecurityEvent {
  event_type: 'login_success' | 'login_failed' | 'logout';
  user_id?: string;
  details: Record<string, any>;
  timestamp: string;
}
