
import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface ContactFormFieldProps {
  type: 'input' | 'textarea';
  inputType?: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  maxLength?: number;
  rows?: number;
  error?: string;
  showCharCount?: boolean;
  fieldId: string;
}

const ContactFormField = ({
  type,
  inputType = 'text',
  placeholder,
  value,
  onChange,
  required = false,
  maxLength,
  rows,
  error,
  showCharCount = false,
  fieldId
}: ContactFormFieldProps) => {
  const errorId = `${fieldId}-error`;
  
  return (
    <div>
      {type === 'input' ? (
        <Input
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          maxLength={maxLength}
          className={error ? 'border-red-500' : ''}
          aria-describedby={error ? errorId : undefined}
        />
      ) : (
        <Textarea
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          rows={rows}
          maxLength={maxLength}
          className={error ? 'border-red-500' : ''}
          aria-describedby={error ? errorId : undefined}
        />
      )}
      
      {error && (
        <p id={errorId} className="text-red-500 text-sm mt-1" role="alert">
          {error}
        </p>
      )}
      
      {showCharCount && maxLength && (
        <p className="text-sm text-gray-500 mt-1">
          {value.length}/{maxLength} caractères
        </p>
      )}
    </div>
  );
};

export default ContactFormField;
