
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useServices } from '@/providers/ServiceProvider';

export const useNavigationSetup = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { navigationService } = useServices();

  useEffect(() => {
    // Configurer la fonction de navigation dans le service
    (navigationService as any).setNavigateFunction(navigate);
    // Mettre à jour le chemin actuel
    (navigationService as any).setCurrentPath(location.pathname);
  }, [navigate, location.pathname, navigationService]);
};
