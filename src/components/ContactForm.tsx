
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  contactFormSchema, 
  sanitizeText, 
  sanitizeEmail, 
  contactFormRateLimit 
} from '@/utils/inputValidation';
import { securityMonitor } from '@/utils/securityMonitoring';
import { z } from 'zod';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();

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
    const clientIP = 'user-session'; // In production, you'd get the actual IP
    if (!contactFormRateLimit.isAllowed(clientIP)) {
      const remainingTime = Math.ceil(contactFormRateLimit.getRemainingTime(clientIP) / 1000 / 60);
      toast({
        title: "Trop de tentatives",
        description: `Veuillez attendre ${remainingTime} minutes avant de soumettre un nouveau message.`,
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      // Validate all fields
      const validatedData = contactFormSchema.parse(formData);
      
      // Additional sanitization before submission
      const sanitizedData = {
        name: sanitizeText(validatedData.name),
        email: sanitizeEmail(validatedData.email),
        phone: validatedData.phone ? sanitizeText(validatedData.phone) : null,
        subject: sanitizeText(validatedData.subject),
        message: sanitizeText(validatedData.message),
        submitted_at: new Date().toISOString(),
        ip_address: 'hidden', // In production, log IP for security
        user_agent: navigator.userAgent.substring(0, 500) // Truncate for security
      };

      const { error } = await supabase
        .from('contact_submissions')
        .insert([sanitizedData]);

      if (error) throw error;

      // Log successful form submission
      await securityMonitor.logFormSubmission('contact', true, {
        name_length: sanitizedData.name.length,
        has_phone: !!sanitizedData.phone
      });

      toast({
        title: "Message envoyé !",
        description: "Nous vous répondrons dans les plus brefs délais.",
      });

      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });

    } catch (error) {
      console.error('Erreur lors de l\'envoi:', error);
      
      // Log failed form submission
      await securityMonitor.logFormSubmission('contact', false, {
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach(err => {
          if (err.path[0]) {
            newErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(newErrors);
        
        toast({
          title: "Erreur de validation",
          description: "Veuillez corriger les erreurs dans le formulaire.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Erreur",
          description: "Impossible d'envoyer le message. Veuillez réessayer.",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      <div>
        <Input
          type="text"
          placeholder="Votre nom *"
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          required
          maxLength={100}
          className={errors.name ? 'border-red-500' : ''}
          aria-describedby={errors.name ? 'name-error' : undefined}
        />
        {errors.name && (
          <p id="name-error" className="text-red-500 text-sm mt-1" role="alert">
            {errors.name}
          </p>
        )}
      </div>

      <div>
        <Input
          type="email"
          placeholder="Votre email *"
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          required
          maxLength={254}
          className={errors.email ? 'border-red-500' : ''}
          aria-describedby={errors.email ? 'email-error' : undefined}
        />
        {errors.email && (
          <p id="email-error" className="text-red-500 text-sm mt-1" role="alert">
            {errors.email}
          </p>
        )}
      </div>

      <div>
        <Input
          type="tel"
          placeholder="Votre téléphone (optionnel)"
          value={formData.phone}
          onChange={(e) => handleInputChange('phone', e.target.value)}
          maxLength={20}
          className={errors.phone ? 'border-red-500' : ''}
          aria-describedby={errors.phone ? 'phone-error' : undefined}
        />
        {errors.phone && (
          <p id="phone-error" className="text-red-500 text-sm mt-1" role="alert">
            {errors.phone}
          </p>
        )}
      </div>

      <div>
        <Input
          type="text"
          placeholder="Sujet *"
          value={formData.subject}
          onChange={(e) => handleInputChange('subject', e.target.value)}
          required
          maxLength={200}
          className={errors.subject ? 'border-red-500' : ''}
          aria-describedby={errors.subject ? 'subject-error' : undefined}
        />
        {errors.subject && (
          <p id="subject-error" className="text-red-500 text-sm mt-1" role="alert">
            {errors.subject}
          </p>
        )}
      </div>

      <div>
        <Textarea
          placeholder="Votre message *"
          value={formData.message}
          onChange={(e) => handleInputChange('message', e.target.value)}
          required
          rows={6}
          maxLength={2000}
          className={errors.message ? 'border-red-500' : ''}
          aria-describedby={errors.message ? 'message-error' : undefined}
        />
        {errors.message && (
          <p id="message-error" className="text-red-500 text-sm mt-1" role="alert">
            {errors.message}
          </p>
        )}
        <p className="text-sm text-gray-500 mt-1">
          {formData.message.length}/2000 caractères
        </p>
      </div>

      <Button 
        type="submit" 
        className="w-full" 
        disabled={loading}
        aria-describedby={loading ? 'loading-message' : undefined}
      >
        {loading ? 'Envoi en cours...' : 'Envoyer le message'}
      </Button>
      
      {loading && (
        <p id="loading-message" className="sr-only">
          Envoi du message en cours, veuillez patienter.
        </p>
      )}
    </form>
  );
};

export default ContactForm;
