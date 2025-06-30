
import React from 'react';
import { Button } from '@/components/ui/button';

interface ContactFormSubmitProps {
  loading: boolean;
}

const ContactFormSubmit = ({ loading }: ContactFormSubmitProps) => {
  return (
    <>
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
    </>
  );
};

export default ContactFormSubmit;
