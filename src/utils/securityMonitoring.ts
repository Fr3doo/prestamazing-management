
import { supabase } from '@/integrations/supabase/client';
import { ISecurityService, SecurityEvent } from '@/interfaces/ISecurityService';

export class SecurityMonitorImpl implements ISecurityService {
  private static instance: SecurityMonitorImpl;
  private events: SecurityEvent[] = [];

  static getInstance(): SecurityMonitorImpl {
    if (!SecurityMonitorImpl.instance) {
      SecurityMonitorImpl.instance = new SecurityMonitorImpl();
    }
    return SecurityMonitorImpl.instance;
  }

  async logLoginAttempt(success: boolean, email?: string, error?: string): Promise<void> {
    const event: SecurityEvent = {
      event_type: success ? 'login_success' : 'login_failed',
      details: {
        email: email ? this.hashEmail(email) : 'unknown',
        error: error || null
      },
      timestamp: new Date().toISOString()
    };

    await this.logEvent(event);
  }

  async logLogout(userId?: string): Promise<void> {
    const event: SecurityEvent = {
      event_type: 'logout',
      user_id: userId,
      details: {},
      timestamp: new Date().toISOString()
    };

    await this.logEvent(event);
  }

  getRecentEvents(limit: number = 50): SecurityEvent[] {
    return this.events.slice(-limit);
  }

  private async logEvent(event: SecurityEvent): Promise<void> {
    try {
      // Store locally for immediate access
      this.events.push(event);

      // Try to persist to database (gracefully handle if table doesn't exist)
      try {
        await supabase.from('security_events').insert([{
          event_type: event.event_type,
          user_id: event.user_id,
          details: event.details,
          timestamp: event.timestamp,
          severity: 'low', // Default severity for all events
          session_id: this.getSessionId(),
          ip_address: 'unknown',
          user_agent: navigator.userAgent.substring(0, 500)
        }]);
      } catch (dbError) {
        // Silently fail if table doesn't exist yet
        console.warn('Security events table not available:', dbError);
      }

      // Log failed login attempts to console for immediate attention
      if (event.event_type === 'login_failed') {
        console.warn('Login failed:', event);
      }

    } catch (error) {
      console.error('Failed to log security event:', error);
    }
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
    const parts = email.split('@');
    if (parts.length === 2) {
      const username = parts[0].length > 2 ? parts[0].substring(0, 2) + '***' : '***';
      return `${username}@${parts[1]}`;
    }
    return '***@***';
  }
}

export const securityMonitor = SecurityMonitorImpl.getInstance();
