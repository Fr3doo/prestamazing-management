
import { useState, useCallback } from 'react';
import { useStandardToast } from './useStandardToast';
import { useFormErrorHandler } from './useFormErrorHandler';

export interface OptimizedFormOptions {
  successMessage?: string;
  errorMessage?: string;
  onSuccess?: () => void;
}

/**
 * Version optimisée de useFormSubmission avec gestion d'erreurs simplifiée
 */
export const useOptimizedFormSubmission = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showSuccess } = useStandardToast();
  const { handleFormSubmit } = useFormErrorHandler();

  const submitForm = useCallback(async <T>(
    submitFn: () => Promise<T>,
    options: OptimizedFormOptions = {}
  ): Promise<T | null> => {
    const {
      successMessage = "Opération réussie",
      onSuccess
    } = options;

    setIsSubmitting(true);

    try {
      const result = await handleFormSubmit(submitFn, null);
      
      if (result !== null) {
        showSuccess("Succès", successMessage);
        onSuccess?.();
      }
      
      return result;
    } finally {
      setIsSubmitting(false);
    }
  }, [handleFormSubmit, showSuccess]);

  return {
    isSubmitting,
    submitForm
  };
};
