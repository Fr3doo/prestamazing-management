
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
  const { signIn, user, isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Timeout pour éviter les boucles infinies de chargement
    const timeout = setTimeout(() => {
      if (authLoading) {
        console.warn('Auth loading timeout - forcing completion');
      }
    }, 10000); // 10 secondes

    // Seulement rediriger si l'authentification est complètement chargée
    if (!authLoading && user) {
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
        // Ne pas rediriger, laisser l'utilisateur sur la page de connexion
      }
    }

    return () => clearTimeout(timeout);
  }, [user, isAdmin, authLoading, navigate, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

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

    setLoading(false);
  };

  // Afficher un indicateur de chargement pendant la vérification d'auth initiale
  // Mais avec un timeout pour éviter les blocages
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-lg mb-4">Vérification des droits d'accès...</div>
              <div className="text-sm text-gray-600">
                Si cette page reste affichée, veuillez rafraîchir la page.
              </div>
              <Button 
                onClick={() => window.location.reload()} 
                variant="outline" 
                className="mt-4"
              >
                Rafraîchir la page
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
