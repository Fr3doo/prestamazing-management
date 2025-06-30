
import { supabase } from '@/integrations/supabase/client';
import { securityMonitor } from '@/utils/securityMonitoring';

export class AdminService {
  static async checkAdminStatus(userId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .eq('role', 'admin')
        .single();
      
      console.log('Admin check result:', { data, error, userId });
      return !!data && !error;
    } catch (error) {
      console.error('Error checking admin status:', error);
      await securityMonitor.logSuspiciousActivity('admin_check_failed', {
        user_id: userId,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      return false;
    }
  }

  static async logAdminAccess(userId: string, adminStatus: boolean): Promise<void> {
    try {
      await securityMonitor.logEvent({
        event_type: 'admin_check',
        details: { 
          user_id: userId,
          admin_status: adminStatus 
        },
        severity: 'low'
      });
    } catch (error) {
      console.error('Error logging admin access:', error);
    }
  }
}
