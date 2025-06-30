
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface ContactValueFieldProps {
  type: string;
  value: string;
  onChange: (value: string) => void;
}

const ContactValueField = ({ type, value, onChange }: ContactValueFieldProps) => {
  const getPlaceholder = () => {
    switch (type) {
      case 'phone':
      case 'whatsapp':
        return "+33 6 00 00 00 00";
      case 'email':
        return "contact@example.com";
      case 'website':
        return "https://www.example.com";
      case 'hours':
        return "Lundi - Vendredi: 9h00 - 19h00\nSamedi: Sur rendez-vous";
      case 'address':
        return "123 Rue de la Restauration\n75001 Paris, France";
      case 'zone':
        return "Paris et région parisienne\nDéplacements possibles dans toute la France";
      default:
        return "Valeur de l'information de contact";
    }
  };

  const getInputType = () => {
    if (type === 'email') return 'email';
    if (type === 'website') return 'url';
    return 'text';
  };

  const isMultiLine = type === 'hours' || type === 'address' || type === 'zone';

  return (
    <div>
      <Label htmlFor="value">Valeur *</Label>
      {isMultiLine ? (
        <Textarea
          id="value"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={getPlaceholder()}
          rows={4}
          required
        />
      ) : (
        <Input
          id="value"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={getPlaceholder()}
          type={getInputType()}
          required
        />
      )}
    </div>
  );
};

export default ContactValueField;
