
export interface SecurityEvent {
  event_type: 'login_success' | 'login_failed' | 'logout';
  user_id?: string;
  details: Record<string, any>;
  timestamp: string;
}

export interface ISecurityService {
  logLoginAttempt(success: boolean, email?: string, error?: string): Promise<void>;
  logLogout(userId?: string): Promise<void>;
  getRecentEvents(limit?: number): SecurityEvent[];
}
