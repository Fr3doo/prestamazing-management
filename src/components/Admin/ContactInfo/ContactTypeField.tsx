
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { contactTypes } from './contactTypes';

interface ContactTypeFieldProps {
  value: string;
  onChange: (value: string) => void;
}

const ContactTypeField = ({ value, onChange }: ContactTypeFieldProps) => {
  return (
    <div>
      <Label htmlFor="type">Type de contact *</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="Sélectionnez un type" />
        </SelectTrigger>
        <SelectContent>
          {contactTypes.map((type) => (
            <SelectItem key={type.value} value={type.value}>
              {type.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default ContactTypeField;
