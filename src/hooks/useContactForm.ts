
import { useGenericFormWithEmail } from '@/hooks/useGenericForm';
import { contactFormSchema } from '@/utils/validationRules';
import { contactFormRateLimit } from '@/utils/inputValidation';
import { supabase } from '@/integrations/supabase/client';
import { useStandardToast } from '@/hooks/useStandardToast';

export const useContactForm = () => {
  const { showError } = useStandardToast();

  return useGenericFormWithEmail({
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

      // Prepare data with all required fields
      const submitData = {
        name: data.name,
        email: data.email,
        subject: data.subject,
        message: data.message,
        phone: data.phone || null,
        submitted_at: new Date().toISOString(),
        ip_address: 'hidden',
        user_agent: navigator.userAgent.substring(0, 500)
      };

      try {
        const { error } = await supabase
          .from('contact_submissions')
          .insert([submitData]);

        if (error) throw error;
      } catch (dbError) {
        console.warn('Contact submissions table not available yet:', dbError);
        console.log('Contact form submission:', submitData);
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
};
