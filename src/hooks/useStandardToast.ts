
import { useToast } from '@/hooks/use-toast';
import { useCallback } from 'react';

export interface StandardToastOptions {
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive';
  duration?: number;
}

export const useStandardToast = () => {
  const { toast } = useToast();

  const showSuccess = useCallback((
    title: string = "Succès",
    description?: string
  ) => {
    toast({
      title,
      description,
      variant: "default",
    });
  }, [toast]);

  const showError = useCallback((
    title: string = "Erreur",
    description?: string
  ) => {
    toast({
      title,
      description,
      variant: "destructive",
    });
  }, [toast]);

  const showInfo = useCallback((
    title: string,
    description?: string
  ) => {
    toast({
      title,
      description,
      variant: "default",
    });
  }, [toast]);

  const showCustom = useCallback((options: StandardToastOptions) => {
    toast(options);
  }, [toast]);

  return {
    showSuccess,
    showError,
    showInfo,
    showCustom,
  };
};
