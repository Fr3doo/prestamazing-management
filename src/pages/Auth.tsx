
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import AuthForm from '@/components/Auth/AuthForm';
import NonAdminMessage from '@/components/Auth/NonAdminMessage';

const Auth = () => {
  const [loading, setLoading] = useState(false);
  const { signIn, signOut, user, isAdmin, initialized } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Simple redirect logic for authenticated admin users
  useEffect(() => {
    if (initialized && user && isAdmin) {
      navigate('/admin', { replace: true });
    }
  }, [initialized, user, isAdmin, navigate]);

  const handleSignIn = async (email: string, password: string) => {
    setLoading(true);
    
    try {
      const { error } = await signIn(email, password);
      
      if (error) {
        toast({
          title: "Erreur de connexion",
          description: error.message,
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Déconnexion réussie",
      description: "Vous pouvez maintenant vous connecter avec un autre compte.",
    });
  };

  // Show loading while initializing
  if (!initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  // Show non-admin message if user is logged in but not admin
  if (user && !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <NonAdminMessage 
          userEmail={user.email || 'utilisateur'} 
          onSignOut={handleSignOut} 
        />
      </div>
    );
  }

  // Show login form for non-authenticated users
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <AuthForm onSubmit={handleSignIn} loading={loading} />
    </div>
  );
};

export default Auth;
