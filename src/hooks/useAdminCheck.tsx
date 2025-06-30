
import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { securityMonitor } from '@/utils/securityMonitoring';

interface UseAdminCheckReturn {
  isAdmin: boolean;
  loading: boolean;
  checkAdminStatus: (userId: string) => Promise<boolean>;
}

export const useAdminCheck = (user: User | null): UseAdminCheckReturn => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(false);

  const checkAdminStatus = async (userId: string) => {
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
  };

  useEffect(() => {
    let isMounted = true;

    if (user) {
      setLoading(true);
      checkAdminStatus(user.id)
        .then((adminStatus) => {
          console.log('Admin status for user:', user.id, adminStatus);
          if (isMounted) {
            setIsAdmin(adminStatus);
          }
        })
        .catch((error) => {
          console.error('Error during admin check:', error);
          if (isMounted) {
            setIsAdmin(false);
          }
        })
        .finally(() => {
          if (isMounted) {
            setLoading(false);
          }
        });
    } else {
      setIsAdmin(false);
      setLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [user?.id]);

  return {
    isAdmin,
    loading,
    checkAdminStatus,
  };
};
