
import { useCallback } from 'react';
import { useSimpleErrorHandler } from './useSimpleErrorHandler';
import { getErrorMessage } from '@/utils/errorMessages';

/**
 * Hook spécialisé pour la gestion d'erreurs dans les formulaires
 */
export const useFormErrorHandler = () => {
  const { handleError, handleAsyncError } = useSimpleErrorHandler();

  const handleFormError = useCallback((error: unknown, fieldName?: string) => {
    const context = fieldName ? `Form field: ${fieldName}` : 'Form';
    return handleError(error, { context, level: 'warning' });
  }, [handleError]);

  const handleFormSubmit = useCallback(async <T>(
    submitFn: () => Promise<T>,
    fallbackValue: T
  ): Promise<T> => {
    return handleAsyncError(
      submitFn,
      fallbackValue,
      'Form submission'
    );
  }, [handleAsyncError]);

  const handleValidationError = useCallback((
    validationErrors: Record<string, string[]>
  ) => {
    const errorCount = Object.keys(validationErrors).length;
    const message = `${errorCount} erreur(s) de validation détectée(s)`;
    
    handleError(new Error(message), { 
      level: 'warning', 
      context: 'Form validation',
      silent: true // Les erreurs de validation sont gérées par le formulaire
    });
    
    return validationErrors;
  }, [handleError]);

  return {
    handleFormError,
    handleFormSubmit,
    handleValidationError,
  };
};
