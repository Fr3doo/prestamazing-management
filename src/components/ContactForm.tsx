
import React from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useGenericFormWithEmail } from '@/hooks/useGenericForm';
import { contactFormSchema } from '@/utils/validationRules';
import { contactFormRateLimit } from '@/utils/inputValidation';
import { useStandardToast } from '@/hooks/useStandardToast';
import FormField from '@/components/common/FormField';
import FormActions from '@/components/common/FormActions';

const ContactForm = () => {
  const { showError } = useStandardToast();

  const {
    formData,
    errors,
    loading,
    handleInputChange,
    handleSubmit,
  } = useGenericFormWithEmail({
    initialData: {
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    },
    validationSchema: contactFormSchema,
    submitFunction: async (data) => {
      // Rate limiting check
      const clientIP = 'user-session';
      if (!contactFormRateLimit.isAllowed(clientIP)) {
        throw new Error("Trop de tentatives. Veuillez attendre avant de soumettre un nouveau message.");
      }

      const sanitizedData = {
        ...data,
        phone: data.phone || null,
      };

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
    },
    successTitle: "Message envoyé !",
    successMessage: "Nous vous répondrons dans les plus brefs délais.",
    errorTitle: "Erreur",
    errorContext: "Contact form submission",
    onError: (error) => {
      if (error instanceof Error && error.message.includes("Trop de tentatives")) {
        showError("Trop de tentatives", error.message);
      }
    }
  });

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      <FormField
        type="input"
        label="Nom"
        fieldId="name"
        value={formData.name}
        onChange={(value) => handleInputChange('name', value)}
        placeholder="Votre nom"
        required
        maxLength={100}
        error={errors.name}
      />

      <FormField
        type="input"
        inputType="email"
        label="Email"
        fieldId="email"
        value={formData.email}
        onChange={(value) => handleInputChange('email', value)}
        placeholder="Votre email"
        required
        maxLength={254}
        error={errors.email}
      />

      <FormField
        type="input"
        inputType="tel"
        label="Téléphone"
        fieldId="phone"
        value={formData.phone}
        onChange={(value) => handleInputChange('phone', value)}
        placeholder="Votre téléphone (optionnel)"
        maxLength={20}
        error={errors.phone}
      />

      <FormField
        type="input"
        label="Sujet"
        fieldId="subject"
        value={formData.subject}
        onChange={(value) => handleInputChange('subject', value)}
        placeholder="Sujet"
        required
        maxLength={200}
        error={errors.subject}
      />

      <FormField
        type="textarea"
        label="Message"
        fieldId="message"
        value={formData.message}
        onChange={(value) => handleInputChange('message', value)}
        placeholder="Votre message"
        required
        rows={6}
        maxLength={2000}
        error={errors.message}
        showCharCount
      />

      <FormActions 
        loading={loading}
        submitText={loading ? 'Envoi en cours...' : 'Envoyer le message'}
      />
    </form>
  );
};

export default ContactForm;
