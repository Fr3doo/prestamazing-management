
import { useState } from 'react';
import { useErrorHandler } from './useErrorHandler';

export interface FormSubmissionOptions<T> {
  onSuccess?: (data: T) => void;
  successMessage?: string;
  errorContext?: string;
}

export const useFormSubmission = <T = any>() => {
  const [loading, setLoading] = useState(false);
  const { handleAsyncError } = useErrorHandler();

  const submitForm = async (
    submitFunction: () => Promise<T>,
    options: FormSubmissionOptions<T> = {}
  ) => {
    const {
      onSuccess,
      successMessage,
      errorContext = 'Form submission'
    } = options;

    setLoading(true);
    
    const result = await handleAsyncError(
      submitFunction,
      {
        title: "Erreur de formulaire",
        logContext: errorContext
      }
    );

    setLoading(false);

    if (result && onSuccess) {
      onSuccess(result);
    }

    return result;
  };

  return { loading, submitForm };
};
