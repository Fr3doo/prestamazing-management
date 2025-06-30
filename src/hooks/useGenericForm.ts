
import { useState, useCallback } from 'react';
import { z } from 'zod';
import { useFormSubmission } from './useFormSubmission';
import { useStandardToast } from './useStandardToast';
import { sanitizeText, sanitizeEmail } from '@/utils/inputValidation';

export interface GenericFormConfig<T> {
  initialData: T;
  validationSchema: z.ZodSchema<T>;
  submitFunction: (data: T) => Promise<void>;
  successTitle?: string;
  successMessage?: string;
  errorTitle?: string;
  errorContext?: string;
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
  sanitizers?: Partial<Record<keyof T, (value: string) => string>>;
}

export const useGenericForm = <T extends Record<string, any>>(
  config: GenericFormConfig<T>
) => {
  const [formData, setFormData] = useState<T>(config.initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { showError } = useStandardToast();
  const { loading, submitForm } = useFormSubmission();

  const validateField = useCallback((field: keyof T, value: any) => {
    try {
      // Validate the entire form data with the updated field
      const testData = { ...formData, [field]: value };
      config.validationSchema.parse(testData);
      setErrors(prev => ({ ...prev, [field as string]: '' }));
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldError = error.errors.find(err => err.path.includes(field as string));
        if (fieldError) {
          setErrors(prev => ({ 
            ...prev, 
            [field as string]: fieldError.message || 'Erreur de validation' 
          }));
        }
      }
      return false;
    }
  }, [config.validationSchema, formData]);

  const handleInputChange = useCallback((field: keyof T, value: string) => {
    // Appliquer la sanitisation spécifique au champ
    const sanitizer = config.sanitizers?.[field];
    const sanitizedValue = sanitizer ? sanitizer(value) : sanitizeText(value);
    
    setFormData(prev => ({ ...prev, [field]: sanitizedValue }));
    
    // Validation en temps réel
    if (value.trim()) {
      validateField(field, sanitizedValue);
    } else {
      setErrors(prev => ({ ...prev, [field as string]: '' }));
    }
  }, [config.sanitizers, validateField]);

  const resetForm = useCallback(() => {
    setFormData(config.initialData);
    setErrors({});
  }, [config.initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    await submitForm(
      async () => {
        // Validation complète
        const validatedData = config.validationSchema.parse(formData);
        await config.submitFunction(validatedData);
        return validatedData;
      },
      {
        successTitle: config.successTitle || "Succès",
        successMessage: config.successMessage || "Opération réussie",
        errorTitle: config.errorTitle || "Erreur",
        errorContext: config.errorContext || "Form submission",
        onSuccess: () => {
          resetForm();
          config.onSuccess?.();
        },
        onError: (error) => {
          if (error instanceof z.ZodError) {
            const newErrors: Record<string, string> = {};
            error.errors.forEach(err => {
              if (err.path[0]) {
                newErrors[err.path[0] as string] = err.message;
              }
            });
            setErrors(newErrors);
            showError("Erreur de validation", "Veuillez corriger les erreurs dans le formulaire.");
          }
          config.onError?.(error);
        }
      }
    );
  };

  return {
    formData,
    errors,
    loading,
    handleInputChange,
    handleSubmit,
    resetForm,
    validateField,
    setFormData,
  };
};

// Hook spécialisé pour les formulaires avec email
export const useGenericFormWithEmail = <T extends Record<string, any>>(
  config: GenericFormConfig<T>
) => {
  return useGenericForm({
    ...config,
    sanitizers: {
      email: sanitizeEmail,
      ...config.sanitizers,
    },
  });
};
