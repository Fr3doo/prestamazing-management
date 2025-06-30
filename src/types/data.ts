
/**
 * Data fetching and optimization types
 */

/**
 * Configuration options for optimized data fetching
 */
export interface DataFetchingOptions<T> {
  /** Initial data to use before fetching */
  initialData?: T;
  /** Context description for error handling */
  errorContext?: string;
  /** Dependencies that trigger refetch */
  dependencies?: React.DependencyList;
  /** Whether to enable caching */
  enableCache?: boolean;
  /** Cache key for data storage */
  cacheKey?: string;
}

/**
 * Result of data fetching operation
 */
export interface DataFetchingResult<T> {
  /** Fetched data, undefined if not loaded */
  data: T | undefined;
  /** Whether fetch is in progress */
  loading: boolean;
  /** Error message if fetch failed */
  error: string | null;
  /** Function to refetch data */
  refetch: () => void;
}

/**
 * Loading state management
 */
export interface LoadingState {
  /** Whether loading is active */
  loading: boolean;
  /** Start loading state */
  startLoading: () => void;
  /** Stop loading state */
  stopLoading: () => void;
}
