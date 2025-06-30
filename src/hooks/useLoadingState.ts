
import { useState, useCallback } from 'react';

export interface LoadingStateOptions {
  initialLoading?: boolean;
}

export const useLoadingState = (options: LoadingStateOptions = {}) => {
  const { initialLoading = false } = options;
  
  const [loading, setLoading] = useState(initialLoading);
  const [error, setError] = useState<string | null>(null);

  const startLoading = useCallback(() => {
    setLoading(true);
    setError(null);
  }, []);

  const stopLoading = useCallback(() => {
    setLoading(false);
  }, []);

  const setLoadingError = useCallback((errorMessage: string) => {
    setLoading(false);
    setError(errorMessage);
  }, []);

  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
  }, []);

  return {
    loading,
    error,
    startLoading,
    stopLoading,
    setLoadingError,
    reset,
    isReady: !loading && !error
  };
};
