
import { useCallback } from 'react';
import { useStandardToast } from './useStandardToast';

export type ErrorLevel = 'info' | 'warning' | 'error' | 'critical';

export interface SimpleErrorOptions {
  level?: ErrorLevel;
  context?: string;
  silent?: boolean;
}

/**
 * Hook simplifié pour la gestion d'erreurs avec niveaux de gravité
 */
export const useSimpleErrorHandler = () => {
  const { showError, showInfo } = useStandardToast();

  const handleError = useCallback((
    error: unknown,
    options: SimpleErrorOptions = {}
  ) => {
    const { level = 'error', context, silent = false } = options;
    
    const errorMessage = error instanceof Error ? error.message : 'Erreur inattendue';
    
    // Log standardisé avec contexte
    const logMessage = context ? `[${context}] ${errorMessage}` : errorMessage;
    
    switch (level) {
      case 'info':
        console.info('Info:', logMessage);
        if (!silent) showInfo('Information', errorMessage);
        break;
      case 'warning':
        console.warn('Warning:', logMessage);
        if (!silent) showInfo('Attention', errorMessage);
        break;
      case 'error':
        console.error('Error:', logMessage);
        if (!silent) showError('Erreur', errorMessage);
        break;
      case 'critical':
        console.error('CRITICAL:', logMessage);
        if (!silent) showError('Erreur critique', errorMessage);
        break;
    }

    return errorMessage;
  }, [showError, showInfo]);

  // Version simplifiée pour les cas courants
  const handleSimpleError = useCallback((error: unknown, context?: string) => {
    return handleError(error, { context });
  }, [handleError]);

  // Gestion async avec fallback automatique
  const handleAsyncError = useCallback(async <T>(
    asyncOperation: () => Promise<T>,
    fallbackValue: T,
    context?: string
  ): Promise<T> => {
    try {
      return await asyncOperation();
    } catch (error) {
      handleError(error, { context, level: 'error' });
      return fallbackValue;
    }
  }, [handleError]);

  return { 
    handleError, 
    handleSimpleError, 
    handleAsyncError 
  };
};
