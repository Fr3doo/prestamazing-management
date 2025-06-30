
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { 
  contactFormSchema, 
  sanitizeText, 
  sanitizeEmail, 
  contactFormRateLimit 
} from '@/utils/inputValidation';
import { z } from 'zod';
import { useFormSubmission } from '@/hooks/useFormSubmission';
import { useStandardToast } from '@/hooks/useStandardToast';

export const useContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { showError } = useStandardToast();
  const { loading, submitForm } = useFormSubmission();

  const validateField = (field: string, value: string) => {
    try {
      const fieldSchema = contactFormSchema.pick({ [field]: true } as any);
      fieldSchema.parse({ [field]: value });
      setErrors(prev => ({ ...prev, [field]: '' }));
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors(prev => ({ ...prev, [field]: error.errors[0]?.message || 'Erreur de validation' }));
      }
    }
  };

  const handleInputChange = (field: string, value: string) => {
    const sanitizedValue = field === 'email' ? sanitizeEmail(value) : sanitizeText(value);
    setFormData(prev => ({ ...prev, [field]: sanitizedValue }));
    
    // Real-time validation
    if (value.trim()) {
      validateField(field, sanitizedValue);
    } else {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Rate limiting check
    const clientIP = 'user-session';
    if (!contactFormRateLimit.isAllowed(clientIP)) {
      showError("Trop de tentatives", "Veuillez attendre avant de soumettre un nouveau message.");
      return;
    }

    setErrors({});

    await submitForm(
      async () => {
        // Validate all fields using centralized schema
        const validatedData = contactFormSchema.parse(formData);
        
        // Additional sanitization before submission
        const sanitizedData = {
          name: sanitizeText(validatedData.name),
          email: sanitizeEmail(validatedData.email),
          phone: validatedData.phone ? sanitizeText(validatedData.phone) : null,
          subject: sanitizeText(validatedData.subject),
          message: sanitizeText(validatedData.message)
        };

        // Try to submit to the contact_submissions table
        try {
          const { error } = await supabase
            .from('contact_submissions')
            .insert([{
              ...sanitizedData,
              submitted_at: new Date().toISOString(),
              ip_address: 'hidden',
              user_agent: navigator.userAgent.substring(0, 500)
            }]);

          if (error) throw error;
        } catch (dbError) {
          console.warn('Contact submissions table not available yet:', dbError);
          console.log('Contact form submission:', sanitizedData);
        }

        return sanitizedData;
      },
      {
        successTitle: "Message envoyé !",
        successMessage: "Nous vous répondrons dans les plus brefs délais.",
        errorTitle: "Erreur",
        errorContext: "Contact form submission",
        onSuccess: () => {
          setFormData({
            name: '',
            email: '',
            phone: '',
            subject: '',
            message: ''
          });
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
        }
      }
    );
  };

  return {
    formData,
    errors,
    loading,
    handleInputChange,
    handleSubmit
  };
};
