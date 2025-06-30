
import { SecurityService, SecurityEvent } from '@/types/services';

/**
 * @deprecated Use SecurityService from @/types/services instead
 * This interface is kept for backward compatibility
 */
export interface ISecurityService extends SecurityService {}

// Re-export for backward compatibility
export type { SecurityEvent } from '@/types/services';
