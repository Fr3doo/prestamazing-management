
import { useSimpleErrorHandler, ErrorLevel } from './useSimpleErrorHandler';

/**
 * Hook avec méthodes prédéfinies pour chaque niveau d'erreur
 */
export const useErrorLevels = () => {
  const { handleError } = useSimpleErrorHandler();

  return {
    logInfo: (error: unknown, context?: string) => 
      handleError(error, { level: 'info', context }),
    
    logWarning: (error: unknown, context?: string) => 
      handleError(error, { level: 'warning', context }),
    
    logError: (error: unknown, context?: string) => 
      handleError(error, { level: 'error', context }),
    
    logCritical: (error: unknown, context?: string) => 
      handleError(error, { level: 'critical', context }),
    
    // Version silencieuse pour les logs uniquement
    logSilent: (error: unknown, context?: string, level: ErrorLevel = 'error') => 
      handleError(error, { level, context, silent: true }),
  };
};
