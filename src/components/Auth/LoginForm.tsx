
import React from 'react';
import { useLoadingSpinner } from '@/hooks/useLoadingSpinner';
import AuthForm from './AuthForm';

interface LoginFormProps {
  onSubmit: (email: string, password: string) => Promise<void>;
  loading: boolean;
}

const LoginForm = ({ onSubmit, loading }: LoginFormProps) => {
  const { LoadingComponent } = useLoadingSpinner({
    initialLoading: loading,
    spinnerText: "Connexion en cours...",
    size: "md"
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        {LoadingComponent}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <AuthForm onSubmit={onSubmit} loading={loading} />
    </div>
  );
};

export default LoginForm;
