
export interface SecurityEvent {
  event_type: 'login_success' | 'login_failed' | 'admin_action' | 'suspicious_activity' | 'form_submission' | 'admin_check';
  user_id?: string;
  ip_address?: string;
  user_agent?: string;
  details: Record<string, any>;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface ISecurityService {
  logEvent(event: SecurityEvent): Promise<void>;
  logLoginAttempt(success: boolean, email?: string, error?: string): Promise<void>;
  logAdminAction(action: string, resource: string, details: Record<string, any>): Promise<void>;
  logSuspiciousActivity(activity: string, details: Record<string, any>): Promise<void>;
  logFormSubmission(formType: string, success: boolean, details: Record<string, any>): Promise<void>;
  getRecentEvents(limit?: number): SecurityEvent[];
}
