import { ISecurityService, SecurityEvent } from '@/interfaces/ISecurityService';
import { ISecurityEventRepository } from '@/interfaces/repositories/ISecurityEventRepository';
import { SupabaseSecurityEventRepository } from '@/repositories/SupabaseSecurityEventRepository';

export class SecurityMonitorImpl implements ISecurityService {
  private static instance: SecurityMonitorImpl;
  private events: SecurityEvent[] = [];
  private repository: ISecurityEventRepository;
  private constructor(repository: ISecurityEventRepository) {
    this.repository = repository;
  }

  static getInstance(
    repository?: ISecurityEventRepository
  ): SecurityMonitorImpl {
    if (!SecurityMonitorImpl.instance) {
      SecurityMonitorImpl.instance = new SecurityMonitorImpl(
        repository || new SupabaseSecurityEventRepository()
      );
    }
    return SecurityMonitorImpl.instance;
  }

  async logLoginAttempt(
    success: boolean,
    email?: string,
    error?: string
  ): Promise<void> {
    const event: SecurityEvent = {
      event_type: success ? 'login_success' : 'login_failed',
      details: {
        email: email ? this.hashEmail(email) : 'unknown',
        error: error || null,
      },
      timestamp: new Date().toISOString(),
    };

    await this.logEvent(event);
  }

  async logLogout(userId?: string): Promise<void> {
    const event: SecurityEvent = {
      event_type: 'logout',
      user_id: userId,
      details: {},
      timestamp: new Date().toISOString(),
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

      // Persist through repository (gracefully handle errors)
      try {
        await this.repository.storeEvent(event);
      } catch (dbError) {
        console.warn('Security events repository error:', dbError);
      }

      // Log failed login attempts to console for immediate attention
      if (event.event_type === 'login_failed') {
        console.warn('Login failed:', event);
      }
    } catch (error) {
      console.error('Failed to log security event:', error);
    }
  }

  private hashEmail(email: string): string {
    const parts = email.split('@');
    if (parts.length === 2) {
      const username =
        parts[0].length > 2 ? parts[0].substring(0, 2) + '***' : '***';
      return `${username}@${parts[1]}`;
    }
    return '***@***';
  }
}

export const securityMonitor = SecurityMonitorImpl.getInstance();
