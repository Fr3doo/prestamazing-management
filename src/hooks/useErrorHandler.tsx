
import { useToast } from '@/hooks/use-toast';
import { useCallback } from 'react';

export interface ErrorHandlerOptions {
  title?: string;
  defaultMessage?: string;
  logContext?: string;
}

export const useErrorHandler = () => {
  const { toast } = useToast();

  const handleError = useCallback((
    error: unknown,
    options: ErrorHandlerOptions = {}
  ) => {
    const {
      title = "Erreur",
      defaultMessage = "Une erreur inattendue s'est produite",
      logContext
    } = options;

    const errorMessage = error instanceof Error ? error.message : defaultMessage;
    
    // Log standardisé
    if (logContext) {
      console.error(`${logContext}:`, error);
    } else {
      console.error('Error:', error);
    }

    // Toast standardisé
    toast({
      title,
      description: errorMessage,
      variant: "destructive",
    });

    return errorMessage;
  }, [toast]);

  const handleAsyncError = useCallback(async <T>(
    asyncOperation: () => Promise<T>,
    options: ErrorHandlerOptions = {}
  ): Promise<T | null> => {
    try {
      return await asyncOperation();
    } catch (error) {
      handleError(error, options);
      return null;
    }
  }, [handleError]);

  return { handleError, handleAsyncError };
};
