
import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface BaseFormFieldProps {
  label: string;
  required?: boolean;
  error?: string;
  help?: string;
  fieldId: string;
}

interface InputFormFieldProps extends BaseFormFieldProps {
  type: 'input';
  inputType?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  maxLength?: number;
  disabled?: boolean;
}

interface TextareaFormFieldProps extends BaseFormFieldProps {
  type: 'textarea';
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  maxLength?: number;
  showCharCount?: boolean;
}

interface SelectFormFieldProps extends BaseFormFieldProps {
  type: 'select';
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  options: Array<{ value: string; label: string }>;
}

type FormFieldProps = InputFormFieldProps | TextareaFormFieldProps | SelectFormFieldProps;

const FormField = (props: FormFieldProps) => {
  const { label, required, error, help, fieldId } = props;
  const errorId = `${fieldId}-error`;
  const helpId = `${fieldId}-help`;

  const renderField = () => {
    switch (props.type) {
      case 'input':
        return (
          <Input
            id={fieldId}
            type={props.inputType || 'text'}
            value={props.value}
            onChange={(e) => props.onChange(e.target.value)}
            placeholder={props.placeholder}
            required={required}
            maxLength={props.maxLength}
            disabled={props.disabled}
            className={error ? 'border-red-500' : ''}
            aria-describedby={[error ? errorId : '', help ? helpId : ''].filter(Boolean).join(' ') || undefined}
          />
        );

      case 'textarea':
        return (
          <Textarea
            id={fieldId}
            value={props.value}
            onChange={(e) => props.onChange(e.target.value)}
            placeholder={props.placeholder}
            required={required}
            rows={props.rows || 4}
            maxLength={props.maxLength}
            className={error ? 'border-red-500' : ''}
            aria-describedby={[error ? errorId : '', help ? helpId : ''].filter(Boolean).join(' ') || undefined}
          />
        );

      case 'select':
        return (
          <Select value={props.value} onValueChange={props.onChange}>
            <SelectTrigger className={error ? 'border-red-500' : ''}>
              <SelectValue placeholder={props.placeholder} />
            </SelectTrigger>
            <SelectContent>
              {props.options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={fieldId}>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      
      {renderField()}
      
      {error && (
        <p id={errorId} className="text-red-500 text-sm" role="alert">
          {error}
        </p>
      )}
      
      {help && (
        <p id={helpId} className="text-xs text-gray-500">
          {help}
        </p>
      )}
      
      {props.type === 'textarea' && props.showCharCount && props.maxLength && (
        <p className="text-sm text-gray-500">
          {props.value.length}/{props.maxLength} caractères
        </p>
      )}
    </div>
  );
};

export default FormField;
