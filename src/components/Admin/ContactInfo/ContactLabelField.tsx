
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface ContactLabelFieldProps {
  value: string;
  onChange: (value: string) => void;
}

const ContactLabelField = ({ value, onChange }: ContactLabelFieldProps) => {
  return (
    <div>
      <Label htmlFor="label">Libellé</Label>
      <Input
        id="label"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="ex: Téléphone principal, Email support..."
      />
      <p className="text-xs text-gray-500 mt-1">
        Nom d'affichage pour cette information de contact
      </p>
    </div>
  );
};

export default ContactLabelField;
