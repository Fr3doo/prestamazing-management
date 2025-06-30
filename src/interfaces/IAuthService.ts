
import { AuthService } from '@/types/services';

/**
 * @deprecated Use AuthService from @/types/services instead
 * This interface is kept for backward compatibility
 */
export interface IAuthService extends AuthService {}

// Re-export types for backward compatibility
export type { SignInResult, SessionResult } from '@/types/auth';
