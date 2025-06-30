import { SecurityEvent } from '@/types/services';

export interface ISecurityEventRepository {
  storeEvent(event: SecurityEvent): Promise<void>;
}
