
import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { IAdminService } from '@/interfaces/IAdminService';
import { useLoadingState } from './useLoadingState';

export interface UseAdminCheckReturn {
  isAdmin: boolean;
  loading: boolean;
  checkAdminStatus: (userId: string) => Promise<boolean>;
}

export const useAdminCheck = (user: User | null, adminService: IAdminService): UseAdminCheckReturn => {
  const [isAdmin, setIsAdmin] = useState(false);
  const { loading, startLoading, stopLoading } = useLoadingState();

  const checkAdminStatus = async (userId: string) => {
    return await adminService.checkAdminStatus(userId);
  };

  useEffect(() => {
    let isMounted = true;

    if (user) {
      startLoading();
      checkAdminStatus(user.id)
        .then(async (adminStatus) => {
          console.log('Admin status for user:', user.id, adminStatus);
          
          // Log admin access attempt using injected service
          await adminService.logAdminAccess(user.id, adminStatus);
          
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
            stopLoading();
          }
        });
    } else {
      setIsAdmin(false);
      stopLoading();
    }

    return () => {
      isMounted = false;
    };
  }, [user?.id, startLoading, stopLoading, adminService]);

  return {
    isAdmin,
    loading,
    checkAdminStatus,
  };
};
