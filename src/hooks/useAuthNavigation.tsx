
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { User } from '@supabase/supabase-js';
import { useServices } from '@/providers/ServiceProvider';
import { useEventBus, useEventSubscription } from '@/hooks/useEventBus';

interface UseAuthNavigationProps {
  user: User | null;
  isAdmin: boolean;
  initialized: boolean;
}

export const useAuthNavigation = ({ user, isAdmin, initialized }: UseAuthNavigationProps) => {
  const { navigationService } = useServices();
  const location = useLocation();
  const { emit } = useEventBus();

  // Mettre à jour le chemin actuel dans le service de navigation
  useEffect(() => {
    navigationService.setCurrentPath(location.pathname);
  }, [location.pathname, navigationService]);

  // Émettre un événement quand l'admin check est terminé
  useEffect(() => {
    if (initialized && user) {
      emit('auth:admin-check-complete', { userId: user.id, isAdmin });
    }
  }, [initialized, user, isAdmin, emit]);

  // Écouter les événements de navigation
  useEventSubscription('navigation:redirect-to-admin', () => {
    navigationService.navigateTo('/admin', { replace: true });
  });

  useEventSubscription('navigation:redirect-to-auth', () => {
    navigationService.navigateTo('/auth', { replace: true });
  });

  // Logique de navigation basée sur l'état auth
  useEffect(() => {
    if (initialized && user && isAdmin) {
      emit('navigation:redirect-to-admin', undefined);
    }
  }, [initialized, user, isAdmin, emit]);
};
