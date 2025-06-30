
import { useState, useEffect, useCallback } from 'react';
import { useErrorHandler } from './useErrorHandler';

export interface DataFetchingOptions<T> {
  initialData?: T;
  errorContext?: string;
  dependencies?: React.DependencyList;
}

export const useDataFetching = <T>(
  fetchFunction: () => Promise<T>,
  options: DataFetchingOptions<T> = {}
) => {
  const {
    initialData,
    errorContext = 'Data fetching',
    dependencies = []
  } = options;

  const [data, setData] = useState<T | undefined>(initialData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { handleAsyncError } = useErrorHandler();

  const fetchData = useCallback(async () => {
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
    } else {
      setError('Erreur lors du chargement des données');
    }
    
    setLoading(false);
  }, [fetchFunction, handleAsyncError, errorContext]);

  useEffect(() => {
    fetchData();
  }, dependencies);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch };
};
