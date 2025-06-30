import { supabase } from '@/integrations/supabase/client';
import { ISecurityEventRepository } from '@/interfaces/repositories/ISecurityEventRepository';
import { SecurityEvent } from '@/types/services';

export class SupabaseSecurityEventRepository
  implements ISecurityEventRepository
{
  async storeEvent(event: SecurityEvent): Promise<void> {
    const { error } = await supabase.from('security_events').insert([
      {
        event_type: event.event_type,
        user_id: event.user_id,
        details: event.details,
        timestamp: event.timestamp,
        severity: 'low',
        session_id: this.getSessionId(),
        ip_address: 'unknown',
        user_agent:
          typeof navigator !== 'undefined'
            ? navigator.userAgent.substring(0, 500)
            : null,
      },
    ]);
    if (error) throw error;
  }

  private getSessionId(): string | null {
    if (typeof sessionStorage === 'undefined') return null;
    let sessionId = sessionStorage.getItem('security_session_id');
    if (!sessionId) {
      sessionId = crypto.randomUUID();
      sessionStorage.setItem('security_session_id', sessionId);
    }
    return sessionId;
  }
}
