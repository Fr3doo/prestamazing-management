
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ExternalLink } from 'lucide-react';

interface PartnerFormFieldsProps {
  partnerName: string;
  websiteUrl: string;
  onPartnerNameChange: (value: string) => void;
  onWebsiteUrlChange: (value: string) => void;
}

const PartnerFormFields = ({
  partnerName,
  websiteUrl,
  onPartnerNameChange,
  onWebsiteUrlChange
}: PartnerFormFieldsProps) => {
  const hasWebsitePreview = Boolean(websiteUrl);

  return (
    <>
      <div>
        <Label htmlFor="partner_name">Nom du partenaire *</Label>
        <Input
          id="partner_name"
          value={partnerName}
          onChange={(e) => onPartnerNameChange(e.target.value)}
          required
          placeholder="Nom de l'entreprise partenaire"
        />
      </div>

      <div>
        <Label htmlFor="website_url">Site web</Label>
        <Input
          id="website_url"
          type="url"
          value={websiteUrl}
          onChange={(e) => onWebsiteUrlChange(e.target.value)}
          placeholder="https://www.exemple.com"
        />
        {hasWebsitePreview && (
          <a
            href={websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 mt-1"
          >
            <ExternalLink className="h-3 w-3" />
            Tester le lien
          </a>
        )}
      </div>
    </>
  );
};

export default PartnerFormFields;
