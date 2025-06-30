
import React from 'react';
import { useGenericForm, GenericFormConfig } from '@/hooks/useGenericForm';
import FormField from './FormField';
import FormActions from './FormActions';

interface GenericFormProps<T extends Record<string, any>> {
  config: GenericFormConfig<T>;
  fields: Array<{
    key: keyof T;
    type: 'input' | 'textarea' | 'select';
    label: string;
    placeholder?: string;
    required?: boolean;
    inputType?: string;
    rows?: number;
    maxLength?: number;
    showCharCount?: boolean;
    options?: Array<{ value: string; label: string }>;
  }>;
  renderCustomFields?: (formData: T, handleInputChange: (field: keyof T, value: string) => void) => React.ReactNode;
  onCancel?: () => void;
  isEditing?: boolean;
  submitText?: string;
  className?: string;
}

const GenericForm = <T extends Record<string, any>>({
  config,
  fields,
  renderCustomFields,
  onCancel,
  isEditing = false,
  submitText,
  className = "space-y-6"
}: GenericFormProps<T>) => {
  const {
    formData,
    errors,
    loading,
    handleInputChange,
    handleSubmit,
  } = useGenericForm(config);

  return (
    <form onSubmit={handleSubmit} className={className} noValidate>
      {fields.map((field) => (
        <FormField
          key={field.key as string}
          type={field.type}
          label={field.label}
          fieldId={field.key as string}
          value={formData[field.key] as string}
          onChange={(value) => handleInputChange(field.key, value)}
          placeholder={field.placeholder}
          required={field.required}
          inputType={field.inputType}
          rows={field.rows}
          maxLength={field.maxLength}
          showCharCount={field.showCharCount}
          options={field.options}
          error={errors[field.key as string]}
        />
      ))}

      {renderCustomFields?.(formData, handleInputChange)}

      <FormActions 
        loading={loading}
        isEditing={isEditing}
        onCancel={onCancel}
        submitText={submitText}
      />
    </form>
  );
};

export default GenericForm;
