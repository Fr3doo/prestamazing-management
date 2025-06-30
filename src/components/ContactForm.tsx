
import React from 'react';
import { useContactForm } from '@/hooks/useContactForm';
import FormField from '@/components/common/FormField';
import FormActions from '@/components/common/FormActions';

const ContactForm = () => {
  const {
    formData,
    errors,
    loading,
    handleInputChange,
    handleSubmit,
  } = useContactForm();

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
