
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useFormFields } from '@/hooks/useFormFields';
import { PartnerSelectors } from '@/utils/selectors';
import { createPartnerFormValidation } from './Partners/PartnerFormValidation';
import { usePartnerFormSubmission } from './Partners/PartnerFormSubmission';
import PartnerFormFields from './Partners/PartnerFormFields';
import PartnerLogoUpload from './Partners/PartnerLogoUpload';

interface Partner {
  id: string;
  partner_name: string;
  logo_url: string;
  website_url: string | null;
  display_order: number;
  created_at: string;
  updated_at: string;
}

interface PartnerFormProps {
  partner?: Partner | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const PartnerForm = ({ partner, onSuccess, onCancel }: PartnerFormProps) => {
  const {
    getFieldValue,
    setField,
    updateFields,
  } = useFormFields({
    partner_name: '',
    website_url: '',
  });
  
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const showSuccess = (title: string, description: string) => {
    toast({ title, description });
  };

  const showError = (title: string, description: string) => {
    toast({ title, description, variant: "destructive" });
  };

  const validation = createPartnerFormValidation(showError);
  
  const { submitForm } = usePartnerFormSubmission({
    partner,
    partnerName: getFieldValue('partner_name'),
    websiteUrl: getFieldValue('website_url'),
    logoFile,
    onSuccess,
    showSuccess,
    showError
  });

  useEffect(() => {
    if (partner) {
      const partnerDisplay = PartnerSelectors.getPartnerDisplay(partner);
      updateFields({
        partner_name: partnerDisplay.name,
        website_url: partnerDisplay.websiteUrl || '',
      });
      setLogoPreview(partnerDisplay.logoUrl);
    }
  }, [partner, updateFields]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validationResult = validation.validateFileUpload(file);
    if (!validationResult.isValid) {
      showError("Erreur", validationResult.error!);
      return;
    }

    setLogoFile(file);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      setLogoPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const hasLogo = Boolean(partner) || Boolean(logoFile);
    const partnerName = getFieldValue('partner_name');
    
    if (!validation.isFormValid(partnerName, hasLogo)) {
      const errors = validation.getValidationErrors(partnerName, hasLogo);
      showError("Erreur", errors[0]);
      return;
    }

    setLoading(true);
    setUploading(Boolean(logoFile));

    try {
      await submitForm();
    } finally {
      setLoading(false);
      setUploading(false);
    }
  };

  const clearLogo = () => {
    setLogoFile(null);
    setLogoPreview('');
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      <PartnerFormFields
        partnerName={getFieldValue('partner_name')}
        websiteUrl={getFieldValue('website_url')}
        onPartnerNameChange={(value) => setField('partner_name', value)}
        onWebsiteUrlChange={(value) => setField('website_url', value)}
      />

      <PartnerLogoUpload
        logoPreview={logoPreview}
        logoFile={logoFile}
        onFileChange={handleFileChange}
        onClearLogo={clearLogo}
      />

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit" disabled={loading || uploading}>
          {uploading ? 'Upload en cours...' : loading ? 'Sauvegarde...' : (partner ? 'Mettre à jour' : 'Ajouter')}
        </Button>
      </div>
    </form>
  );
};

export default PartnerForm;
