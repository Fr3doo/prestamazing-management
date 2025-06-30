
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useErrorHandler } from './useErrorHandler';

export interface FormSubmissionOptions {
  successTitle?: string;
  successMessage?: string;
  errorTitle?: string;
  errorContext?: string;
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
}

export const useFormSubmission = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { handleError } = useErrorHandler();

  const submitForm = useCallback(async <T>(
    submitFunction: () => Promise<T>,
    options: FormSubmissionOptions = {}
  ): Promise<T | null> => {
    const {
      successTitle = "Succès",
      successMessage = "Opération réussie",
      errorTitle = "Erreur",
      errorContext = "Form submission",
      onSuccess,
      onError
    } = options;

    setLoading(true);

    try {
      const result = await submitFunction();
      
      toast({
        title: successTitle,
        description: successMessage,
      });

      onSuccess?.();
      return result;
    } catch (error) {
      handleError(error, {
        title: errorTitle,
        logContext: errorContext
      });
      
      onError?.(error);
      return null;
    } finally {
      setLoading(false);
    }
  }, [toast, handleError]);

  return {
    loading,
    submitForm
  };
};
