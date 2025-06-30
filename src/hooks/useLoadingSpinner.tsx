
import React from 'react';
import { useLoadingState, LoadingStateOptions } from './useLoadingState';
import LoadingSpinner from '@/components/ui/loading-spinner';

interface LoadingSpinnerOptions extends LoadingStateOptions {
  spinnerText?: string;
  spinnerSize?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
}

export const useLoadingSpinner = (options: LoadingSpinnerOptions = {}) => {
  const { 
    spinnerText = 'Chargement...', 
    spinnerSize = 'md', 
    fullScreen = false,
    ...loadingOptions 
  } = options;
  
  const loadingState = useLoadingState(loadingOptions);

  const LoadingComponent = React.useMemo(() => {
    if (!loadingState.loading) return null;
    
    return (
      <LoadingSpinner 
        text={spinnerText}
        size={spinnerSize}
        fullScreen={fullScreen}
      />
    );
  }, [loadingState.loading, spinnerText, spinnerSize, fullScreen]);

  return {
    ...loadingState,
    LoadingComponent
  };
};
