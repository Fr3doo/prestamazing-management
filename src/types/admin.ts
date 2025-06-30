
/**
 * Admin-specific types and interfaces
 */

/**
 * Admin service interface for user privilege management
 */
export interface AdminService {
  /** Check if a user has admin privileges */
  checkAdminStatus: (userId: string) => Promise<boolean>;
  /** Log admin access attempt for security monitoring */
  logAdminAccess: (userId: string, adminStatus: boolean) => Promise<void>;
}

/**
 * Admin check hook return type
 */
export interface AdminCheckResult {
  /** Whether the user has admin privileges */
  isAdmin: boolean;
  /** Whether the admin check is in progress */
  loading: boolean;
  /** Function to manually check admin status */
  checkAdminStatus: (userId: string) => Promise<boolean>;
}
