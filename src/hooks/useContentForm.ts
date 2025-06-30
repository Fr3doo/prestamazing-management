
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useStandardToast } from '@/hooks/useStandardToast';
import { useFormSubmission } from '@/hooks/useFormSubmission';
import { contentSectionSchema, sanitizeText } from '@/utils/validationRules';
import { z } from 'zod';

interface ContentSection {
  id: string;
  section_key: string;
  title: string | null;
  content: string | null;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

interface UseContentFormProps {
  section?: ContentSection | null;
  onSuccess: () => void;
}

export const useContentForm = ({ section, onSuccess }: UseContentFormProps) => {
  const [formData, setFormData] = useState({
    section_key: '',
    title: '',
    content: '',
    image_url: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { showError } = useStandardToast();
  const { loading, submitForm } = useFormSubmission();

  useEffect(() => {
    if (section) {
      setFormData({
        section_key: section.section_key,
        title: section.title || '',
        content: section.content || '',
        image_url: section.image_url || '',
      });
    }
  }, [section]);

  const validateField = useCallback((field: string, value: string) => {
    try {
      const fieldSchema = contentSectionSchema.pick({ [field]: true } as any);
      fieldSchema.parse({ [field]: value });
      setErrors(prev => ({ ...prev, [field]: '' }));
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors(prev => ({ ...prev, [field]: error.errors[0]?.message || 'Erreur de validation' }));
      }
    }
  }, []);

  const handleInputChange = useCallback((field: string, value: string) => {
    const sanitizedValue = sanitizeText(value);
    setFormData(prev => ({ ...prev, [field]: sanitizedValue }));
    
    if (value.trim()) {
      validateField(field, sanitizedValue);
    } else {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  }, [validateField]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.section_key.trim()) {
      showError("Erreur", "Veuillez remplir la clé de section");
      return;
    }

    const submitOperation = async () => {
      // Validate using centralized schema
      const validatedData = contentSectionSchema.parse(formData);
      
      // Additional sanitization
      const sanitizedData = {
        section_key: sanitizeText(validatedData.section_key),
        title: validatedData.title ? sanitizeText(validatedData.title) : null,
        content: validatedData.content ? sanitizeText(validatedData.content) : null,
        image_url: validatedData.image_url || null,
      };

      if (section) {
        const { error } = await supabase
          .from('content_sections')
          .update({
            ...sanitizedData,
            updated_at: new Date().toISOString(),
          })
          .eq('id', section.id);

        if (error) throw error;
        console.log('Content section updated:', sanitizedData.section_key);
      } else {
        const { error } = await supabase
          .from('content_sections')
          .insert([sanitizedData]);

        if (error) throw error;
        console.log('Content section created:', sanitizedData.section_key);
      }

      return sanitizedData;
    };

    await submitForm(submitOperation, {
      successTitle: "Succès",
      successMessage: section ? "Section mise à jour avec succès" : "Section créée avec succès",
      errorTitle: "Erreur",
      errorContext: 'Content form submission',
      onSuccess: () => onSuccess(),
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
    });
  };

  return {
    formData,
    errors,
    loading,
    handleInputChange,
    handleSubmit,
  };
};
