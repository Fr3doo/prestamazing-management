
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasTriedToLogin, setHasTriedToLogin] = useState(false);
  const { signIn, user, isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Only redirect or show error if user has tried to login
    if (user && hasTriedToLogin && !authLoading) {
      if (isAdmin) {
        console.log('Redirecting to admin dashboard');
        navigate('/admin');
      } else {
        console.log('User is not admin, showing error');
        toast({
          title: "Accès refusé",
          description: "Vous n'avez pas les droits d'administration.",
          variant: "destructive",
        });
        setHasTriedToLogin(false); // Reset so error doesn't persist
      }
    }
  }, [user, isAdmin, authLoading, navigate, toast, hasTriedToLogin]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setHasTriedToLogin(true);

    console.log('Attempting to sign in with:', email);
    const { error } = await signIn(email, password);

    if (error) {
      console.error('Sign in error:', error);
      toast({
        title: "Erreur de connexion",
        description: error.message,
        variant: "destructive",
      });
      setHasTriedToLogin(false); // Reset on login error
    }

    setLoading(false);
  };

  // Show loading only during auth initialization
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-lg mb-4">Initialisation...</div>
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold text-primary">
            Administration
          </CardTitle>
          <p className="text-center text-gray-600">
            Connectez-vous à votre espace d'administration
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <Input
                type="password"
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading}
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
