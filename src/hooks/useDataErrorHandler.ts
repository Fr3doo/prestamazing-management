
import { useCallback } from 'react';
import { useSimpleErrorHandler } from './useSimpleErrorHandler';
import { getErrorMessage } from '@/utils/errorMessages';

/**
 * Hook spécialisé pour la gestion d'erreurs de données
 */
export const useDataErrorHandler = () => {
  const { handleError, handleAsyncError } = useSimpleErrorHandler();

  const handleDataLoad = useCallback(async <T>(
    loadFn: () => Promise<T>,
    fallbackValue: T,
    dataType?: string
  ): Promise<T> => {
    const context = dataType ? `Loading ${dataType}` : 'Data loading';
    return handleAsyncError(loadFn, fallbackValue, context);
  }, [handleAsyncError]);

  const handleDataSave = useCallback(async <T>(
    saveFn: () => Promise<T>,
    fallbackValue: T,
    dataType?: string
  ): Promise<T> => {
    const context = dataType ? `Saving ${dataType}` : 'Data saving';
    return handleAsyncError(saveFn, fallbackValue, context);
  }, [handleAsyncError]);

  const handleDataNotFound = useCallback((dataType?: string) => {
    const message = dataType 
      ? `${dataType} introuvable` 
      : getErrorMessage('DATA_NOT_FOUND');
    
    return handleError(new Error(message), { 
      level: 'warning',
      context: 'Data access'
    });
  }, [handleError]);

  return {
    handleDataLoad,
    handleDataSave,
    handleDataNotFound,
  };
};
