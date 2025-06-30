
import { supabase } from '@/integrations/supabase/client';
import { IAdminService } from '@/interfaces/IAdminService';

export class AdminServiceImpl implements IAdminService {
  async checkAdminStatus(userId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .eq('role', 'admin')
        .single();
      
      const isAdmin = !!data && !error;
      console.log('Admin check result:', { userId: this.maskUserId(userId), isAdmin });
      
      return isAdmin;
    } catch (error) {
      console.error('Error checking admin status:', error);
      console.warn('Admin check failed:', {
        user_id: this.maskUserId(userId),
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      return false;
    }
  }

  async logAdminAccess(userId: string, adminStatus: boolean): Promise<void> {
    try {
      console.log('Admin access logged:', { 
        user_id: this.maskUserId(userId),
        admin_status: adminStatus 
      });
    } catch (error) {
      console.error('Error logging admin access:', error);
    }
  }

  private maskUserId(userId: string): string {
    return userId.length > 8 ? `${userId.substring(0, 8)}...` : userId;
  }
}

// Singleton instance pour compatibilité avec le code existant
export const AdminService = new AdminServiceImpl();
