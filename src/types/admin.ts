
/**
 * Admin-specific types and interfaces with ISP compliance
 */

/**
 * Admin privilege checking operations
 * Focused only on privilege verification
 */
export interface AdminPrivilegeChecker {
  /** Check if a user has admin privileges */
  checkAdminStatus: (userId: string) => Promise<boolean>;
}

/**
 * Admin activity auditing
 * Separated from privilege operations
 */
export interface AdminActivityAuditor {
  /** Log admin access attempt for security monitoring */
  logAdminAccess: (userId: string, adminStatus: boolean) => Promise<void>;
}

/**
 * Complete admin service interface
 * Composition of specialized admin interfaces
 */
export interface AdminService extends AdminPrivilegeChecker, AdminActivityAuditor {}

/**
 * Admin check hook result
 * Focused on hook-specific return values
 */
export interface AdminCheckResult {
  /** Whether the user has admin privileges */
  isAdmin: boolean;
  /** Whether the admin check is in progress */
  loading: boolean;
  /** Function to manually check admin status */
  checkAdminStatus: (userId: string) => Promise<boolean>;
}

/**
 * Admin state management
 * Read-only admin state information
 */
export interface AdminState {
  /** Current admin status */
  isAdmin: boolean;
  /** Loading state for admin checks */
  loading: boolean;
}

/**
 * Admin actions
 * Operations available for admin management
 */
export interface AdminActions {
  /** Manually trigger admin status check */
  checkAdminStatus: (userId: string) => Promise<boolean>;
  /** Refresh current user's admin status */
  refreshAdminStatus: () => Promise<void>;
}
