import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useStandardToast } from '@/hooks/useStandardToast';
import { useFormSubmission } from '@/hooks/useFormSubmission';
import { contentSectionSchema, sanitizeText } from '@/utils/inputValidation';
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

interface ContentFormProps {
  section?: ContentSection | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const ContentForm = ({ section, onSuccess, onCancel }: ContentFormProps) => {
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

  const validateField = (field: string, value: string) => {
    try {
      const fieldSchema = contentSectionSchema.pick({ [field]: true } as any);
      fieldSchema.parse({ [field]: value });
      setErrors(prev => ({ ...prev, [field]: '' }));
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors(prev => ({ ...prev, [field]: error.errors[0]?.message || 'Erreur de validation' }));
      }
    }
  };

  const handleInputChange = (field: string, value: string) => {
    const sanitizedValue = sanitizeText(value);
    setFormData(prev => ({ ...prev, [field]: sanitizedValue }));
    
    if (value.trim()) {
      validateField(field, sanitizedValue);
    } else {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.section_key.trim()) {
      showError("Erreur", "Veuillez remplir la clé de section");
      return;
    }

    const submitOperation = async () => {
      // Validate all fields
      const validatedData = contentSectionSchema.parse(formData);
      
      // Additional sanitization
      const sanitizedData = {
        section_key: sanitizeText(validatedData.section_key),
        title: validatedData.title ? sanitizeText(validatedData.title) : null,
        content: validatedData.content ? sanitizeText(validatedData.content) : null,
        image_url: validatedData.image_url || null,
      };

      if (section) {
        // Update
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
        // Create
        const { error } = await supabase
          .from('content_sections')
          .insert([sanitizedData]);

        if (error) throw error;
        console.log('Content section created:', sanitizedData.section_key);
      }

      return sanitizedData;
    };

    const result = await submitForm(submitOperation, {
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

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6" noValidate>
      <div>
        <Label htmlFor="section_key">Clé de section *</Label>
        <Input
          id="section_key"
          value={formData.section_key}
          onChange={(e) => handleInputChange('section_key', e.target.value)}
          required
          placeholder="ex: hero_title"
          disabled={!!section}
          maxLength={50}
          className={errors.section_key ? 'border-red-500' : ''}
          aria-describedby={errors.section_key ? 'section_key-error' : undefined}
        />
        {errors.section_key && (
          <p id="section_key-error" className="text-red-500 text-sm mt-1" role="alert">
            {errors.section_key}
          </p>
        )}
        <p className="text-xs text-gray-500 mt-1">
          Identifiant unique technique (ne pas modifier pour les sections existantes)
        </p>
      </div>

      <div>
        <Label htmlFor="title">Titre</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => handleInputChange('title', e.target.value)}
          placeholder="Titre de la section"
          maxLength={200}
          className={errors.title ? 'border-red-500' : ''}
          aria-describedby={errors.title ? 'title-error' : undefined}
        />
        {errors.title && (
          <p id="title-error" className="text-red-500 text-sm mt-1" role="alert">
            {errors.title}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="content">Contenu</Label>
        <Textarea
          id="content"
          value={formData.content}
          onChange={(e) => handleInputChange('content', e.target.value)}
          placeholder="Contenu de la section"
          rows={6}
          maxLength={5000}
          className={errors.content ? 'border-red-500' : ''}
          aria-describedby={errors.content ? 'content-error' : undefined}
        />
        {errors.content && (
          <p id="content-error" className="text-red-500 text-sm mt-1" role="alert">
            {errors.content}
          </p>
        )}
        <p className="text-sm text-gray-500 mt-1">
          {formData.content.length}/5000 caractères
        </p>
      </div>

      <div>
        <Label htmlFor="image_url">URL de l'image</Label>
        <Input
          id="image_url"
          value={formData.image_url}
          onChange={(e) => handleInputChange('image_url', e.target.value)}
          placeholder="https://example.com/image.jpg"
          type="url"
          maxLength={500}
          className={errors.image_url ? 'border-red-500' : ''}
          aria-describedby={errors.image_url ? 'image_url-error' : undefined}
        />
        {errors.image_url && (
          <p id="image_url-error" className="text-red-500 text-sm mt-1" role="alert">
            {errors.image_url}
          </p>
        )}
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Sauvegarde...' : (section ? 'Mettre à jour' : 'Créer')}
        </Button>
      </div>
    </form>
  );
};

export default ContentForm;
