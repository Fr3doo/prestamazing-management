
import React from 'react';

// Pattern Render Props pour état de chargement
interface LoadingRenderProps {
  loading: boolean;
  children: (props: { loading: boolean }) => React.ReactNode;
}

export const LoadingRenderer = ({ loading, children }: LoadingRenderProps) => {
  return <>{children({ loading })}</>;
};

// Pattern Render Props pour gestion d'erreurs
interface ErrorRenderProps {
  error: string | null;
  children: (props: { error: string | null; hasError: boolean }) => React.ReactNode;
}

export const ErrorRenderer = ({ error, children }: ErrorRenderProps) => {
  return <>{children({ error, hasError: !!error })}</>;
};

// Pattern Render Props pour données
interface DataRenderProps<T> {
  data: T[];
  loading: boolean;
  error: string | null;
  children: (props: {
    data: T[];
    loading: boolean;
    error: string | null;
    hasData: boolean;
    isEmpty: boolean;
  }) => React.ReactNode;
}

export const DataRenderer = <T,>({ data, loading, error, children }: DataRenderProps<T>) => {
  return (
    <>
      {children({
        data,
        loading,
        error,
        hasData: data.length > 0,
        isEmpty: data.length === 0 && !loading
      })}
    </>
  );
};

// Pattern Render Props pour état de form
interface FormRenderProps<T> {
  formData: T;
  errors: Record<string, string>;
  loading: boolean;
  children: (props: {
    formData: T;
    errors: Record<string, string>;
    loading: boolean;
    hasErrors: boolean;
    isValid: boolean;
  }) => React.ReactNode;
}

export const FormRenderer = <T,>({ formData, errors, loading, children }: FormRenderProps<T>) => {
  const hasErrors = Object.keys(errors).some(key => errors[key]);
  
  return (
    <>
      {children({
        formData,
        errors,
        loading,
        hasErrors,
        isValid: !hasErrors
      })}
    </>
  );
};
