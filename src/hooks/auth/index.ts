
export { useAuth, AuthProvider } from '../useAuth';
export { useAuthState } from '../useAuthState';
export { useAuthActions } from '../useAuthActions';
export { useAdminCheck } from '../useAdminCheck';

// Export the correct types from the new type system
export type { AuthState, AuthActions, AdminAuthState } from '@/types/auth';
export type { AdminCheckResult } from '@/types/admin';
