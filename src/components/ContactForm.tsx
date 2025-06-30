
import React from 'react';
import { useContactForm } from '@/hooks/useContactForm';
import ContactFormField from '@/components/ContactForm/ContactFormField';
import ContactFormSubmit from '@/components/ContactForm/ContactFormSubmit';

const ContactForm = () => {
  const {
    formData,
    errors,
    loading,
    handleInputChange,
    handleSubmit
  } = useContactForm();

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      <ContactFormField
        type="input"
        placeholder="Votre nom *"
        value={formData.name}
        onChange={(value) => handleInputChange('name', value)}
        required
        maxLength={100}
        error={errors.name}
        fieldId="name"
      />

      <ContactFormField
        type="input"
        inputType="email"
        placeholder="Votre email *"
        value={formData.email}
        onChange={(value) => handleInputChange('email', value)}
        required
        maxLength={254}
        error={errors.email}
        fieldId="email"
      />

      <ContactFormField
        type="input"
        inputType="tel"
        placeholder="Votre téléphone (optionnel)"
        value={formData.phone}
        onChange={(value) => handleInputChange('phone', value)}
        maxLength={20}
        error={errors.phone}
        fieldId="phone"
      />

      <ContactFormField
        type="input"
        placeholder="Sujet *"
        value={formData.subject}
        onChange={(value) => handleInputChange('subject', value)}
        required
        maxLength={200}
        error={errors.subject}
        fieldId="subject"
      />

      <ContactFormField
        type="textarea"
        placeholder="Votre message *"
        value={formData.message}
        onChange={(value) => handleInputChange('message', value)}
        required
        rows={6}
        maxLength={2000}
        error={errors.message}
        showCharCount
        fieldId="message"
      />

      <ContactFormSubmit loading={loading} />
    </form>
  );
};

export default ContactForm;
