
import { useCallback } from 'react';
import { useStandardToast } from './useStandardToast';

export interface ErrorHandlerOptions {
  title?: string;
  defaultMessage?: string;
  logContext?: string;
  showToast?: boolean;
}

export const useErrorHandler = () => {
  const { showError } = useStandardToast();

  const handleError = useCallback((
    error: unknown,
    options: ErrorHandlerOptions = {}
  ) => {
    const {
      title = "Erreur",
      defaultMessage = "Une erreur inattendue s'est produite",
      logContext,
      showToast = true
    } = options;

    const errorMessage = error instanceof Error ? error.message : defaultMessage;
    
    // Log standardisé
    if (logContext) {
      console.error(`${logContext}:`, error);
    } else {
      console.error('Error:', error);
    }

    // Toast standardisé
    if (showToast) {
      showError(title, errorMessage);
    }

    return errorMessage;
  }, [showError]);

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
