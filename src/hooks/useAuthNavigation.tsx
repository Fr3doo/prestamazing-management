
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '@supabase/supabase-js';

interface UseAuthNavigationProps {
  user: User | null;
  isAdmin: boolean;
  initialized: boolean;
}

export const useAuthNavigation = ({ user, isAdmin, initialized }: UseAuthNavigationProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (initialized && user && isAdmin) {
      navigate('/admin', { replace: true });
    }
  }, [initialized, user, isAdmin, navigate]);
};
