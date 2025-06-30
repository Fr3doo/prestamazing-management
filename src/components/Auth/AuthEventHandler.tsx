
import { useEffect } from 'react';
import { useEventSubscription } from '@/hooks/useEventBus';
import { useToast } from '@/hooks/use-toast';

const AuthEventHandler = () => {
  const { toast } = useToast();

  // Écouter uniquement les événements de notification
  useEventSubscription('auth:login-failed', (data) => {
    toast({
      title: "Erreur de connexion",
      description: data.error,
      variant: "destructive",
    });
  });

  useEventSubscription('auth:logout', () => {
    toast({
      title: "Déconnexion réussie",
      description: "Vous pouvez maintenant vous connecter avec un autre compte.",
    });
  });

  return null;
};

export default AuthEventHandler;
