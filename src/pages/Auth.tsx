
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
  const [formLoading, setFormLoading] = useState(false);
  const { signIn, user, isAdmin, loading: authLoading, initialized } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Only redirect if user is authenticated AND is admin AND auth is initialized
    if (initialized && user && isAdmin) {
      console.log('Redirecting to admin dashboard');
      navigate('/admin');
    }
  }, [user, isAdmin, initialized, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Erreur",
        description: "Veuillez saisir votre email et mot de passe.",
        variant: "destructive",
      });
      return;
    }

    setFormLoading(true);

    try {
      console.log('Attempting to sign in with:', email);
      const { error } = await signIn(email, password);

      if (error) {
        console.error('Sign in error:', error);
        toast({
          title: "Erreur de connexion",
          description: error.message,
          variant: "destructive",
        });
      }
      // Note: Success handling and redirection is managed by useEffect above
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: "Erreur",
        description: "Une erreur inattendue s'est produite.",
        variant: "destructive",
      });
    } finally {
      setFormLoading(false);
    }
  };

  // Show loading only during initial auth check
  if (!initialized) {
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

  // If user is authenticated but not admin, show access denied
  if (initialized && user && !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-lg mb-4 text-red-600">Accès refusé</div>
              <p className="text-gray-600 mb-4">
                Vous n'avez pas les droits d'administration.
              </p>
              <Button 
                onClick={() => window.location.reload()} 
                variant="outline"
              >
                Réessayer
              </Button>
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
                disabled={formLoading || authLoading}
              />
            </div>
            <div>
              <Input
                type="password"
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={formLoading || authLoading}
              />
            </div>
            <Button 
              type="submit" 
              className="w-full" 
              disabled={formLoading || authLoading}
            >
              {formLoading ? 'Connexion...' : 'Se connecter'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
