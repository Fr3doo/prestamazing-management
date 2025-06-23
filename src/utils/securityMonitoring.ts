
import { supabase } from '@/integrations/supabase/client';

export interface SecurityEvent {
  event_type: 'login_success' | 'login_failed' | 'admin_action' | 'suspicious_activity' | 'form_submission';
  user_id?: string;
  ip_address?: string;
  user_agent?: string;
  details: Record<string, any>;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export class SecurityMonitor {
  private static instance: SecurityMonitor;
  private events: SecurityEvent[] = [];

  static getInstance(): SecurityMonitor {
    if (!SecurityMonitor.instance) {
      SecurityMonitor.instance = new SecurityMonitor();
    }
    return SecurityMonitor.instance;
  }

  async logEvent(event: SecurityEvent): Promise<void> {
    try {
      // Add timestamp and session info
      const enrichedEvent = {
        ...event,
        timestamp: new Date().toISOString(),
        session_id: this.getSessionId(),
        ip_address: event.ip_address || 'unknown',
        user_agent: event.user_agent || navigator.userAgent.substring(0, 500)
      };

      // Store locally for immediate access
      this.events.push(enrichedEvent);

      // Persist to database with proper error handling
      try {
        const { error } = await supabase
          .from('security_events')
          .insert([enrichedEvent]);
        
        if (error) {
          console.warn('Failed to log security event to database:', error);
        }
      } catch (dbError) {
        // Silently fail if table doesn't exist or other DB issues
        console.warn('Security events table not available:', dbError);
      }

      // Log high severity events to console for immediate attention
      if (event.severity === 'high' || event.severity === 'critical') {
        console.warn('High severity security event:', enrichedEvent);
      }

    } catch (error) {
      console.error('Failed to log security event:', error);
    }
  }

  async logLoginAttempt(success: boolean, email?: string, error?: string): Promise<void> {
    await this.logEvent({
      event_type: success ? 'login_success' : 'login_failed',
      details: {
        email: email ? this.hashEmail(email) : 'unknown',
        error: error || null,
        timestamp: new Date().toISOString()
      },
      severity: success ? 'low' : 'medium'
    });
  }

  async logAdminAction(action: string, resource: string, details: Record<string, any>): Promise<void> {
    await this.logEvent({
      event_type: 'admin_action',
      user_id: (await supabase.auth.getUser()).data.user?.id,
      details: {
        action,
        resource,
        ...details,
        timestamp: new Date().toISOString()
      },
      severity: 'medium'
    });
  }

  async logSuspiciousActivity(activity: string, details: Record<string, any>): Promise<void> {
    await this.logEvent({
      event_type: 'suspicious_activity',
      details: {
        activity,
        ...details,
        timestamp: new Date().toISOString()
      },
      severity: 'high'
    });
  }

  async logFormSubmission(formType: string, success: boolean, details: Record<string, any>): Promise<void> {
    await this.logEvent({
      event_type: 'form_submission',
      details: {
        form_type: formType,
        success,
        ...details,
        timestamp: new Date().toISOString()
      },
      severity: 'low'
    });
  }

  getRecentEvents(limit: number = 50): SecurityEvent[] {
    return this.events.slice(-limit);
  }

  private getSessionId(): string {
    let sessionId = sessionStorage.getItem('security_session_id');
    if (!sessionId) {
      sessionId = crypto.randomUUID();
      sessionStorage.setItem('security_session_id', sessionId);
    }
    return sessionId;
  }

  private hashEmail(email: string): string {
    // Simple hash for privacy (in production, use proper hashing)
    const parts = email.split('@');
    if (parts.length === 2) {
      const username = parts[0].length > 2 ? parts[0].substring(0, 2) + '***' : '***';
      return `${username}@${parts[1]}`;
    }
    return '***@***';
  }
}

export const securityMonitor = SecurityMonitor.getInstance();
