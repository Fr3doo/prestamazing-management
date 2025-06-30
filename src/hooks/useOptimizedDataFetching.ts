
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useErrorHandler } from './useErrorHandler';

export interface OptimizedDataFetchingOptions<T> {
  initialData?: T;
  errorContext?: string;
  dependencies?: React.DependencyList;
  enableCache?: boolean;
  cacheKey?: string;
}

// Simple in-memory cache
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const useOptimizedDataFetching = <T>(
  fetchFunction: () => Promise<T>,
  options: OptimizedDataFetchingOptions<T> = {}
) => {
  const {
    initialData,
    errorContext = 'Data fetching',
    dependencies = [],
    enableCache = false,
    cacheKey
  } = options;

  const [data, setData] = useState<T | undefined>(initialData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { handleAsyncError } = useErrorHandler();

  const getCachedData = useCallback((key: string) => {
    if (!enableCache || !key) return null;
    
    const cached = cache.get(key);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data;
    }
    return null;
  }, [enableCache]);

  const setCachedData = useCallback((key: string, data: T) => {
    if (!enableCache || !key) return;
    
    cache.set(key, { data, timestamp: Date.now() });
  }, [enableCache]);

  const fetchData = useCallback(async () => {
    // Check cache first
    if (cacheKey) {
      const cachedData = getCachedData(cacheKey);
      if (cachedData) {
        setData(cachedData);
        setLoading(false);
        return;
      }
    }

    setLoading(true);
    setError(null);
    
    const result = await handleAsyncError(
      fetchFunction,
      {
        title: "Erreur de chargement",
        logContext: errorContext
      }
    );

    if (result) {
      setData(result);
      if (cacheKey) {
        setCachedData(cacheKey, result);
      }
    } else {
      setError('Erreur lors du chargement des données');
    }
    
    setLoading(false);
  }, [fetchFunction, handleAsyncError, errorContext, cacheKey, getCachedData, setCachedData]);

  useEffect(() => {
    fetchData();
  }, dependencies);

  const refetch = useCallback(() => {
    // Clear cache for this key before refetching
    if (cacheKey && enableCache) {
      cache.delete(cacheKey);
    }
    fetchData();
  }, [fetchData, cacheKey, enableCache]);

  const memoizedReturn = useMemo(() => ({
    data,
    loading,
    error,
    refetch
  }), [data, loading, error, refetch]);

  return memoizedReturn;
};
