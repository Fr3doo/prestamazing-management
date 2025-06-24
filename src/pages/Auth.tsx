
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
  const { signIn, signOut, user, isAdmin, initialized } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

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
      setLoading(false);
    } else {
      // Don't set loading to false here, let the useEffect handle navigation
      console.log('Sign in successful, waiting for auth state update');
    }
  };

  const handleSignOut = async () => {
    console.log('Signing out current user');
    await signOut();
    setEmail('');
    setPassword('');
  };

  // Handle navigation after successful login
  useEffect(() => {
    if (initialized && user && isAdmin) {
      console.log('User is admin, redirecting to admin dashboard');
      navigate('/admin', { replace: true });
    } else if (initialized && user && !isAdmin) {
      console.log('User is not admin, showing error');
      toast({
        title: "Accès refusé",
        description: "Vous n'avez pas les droits d'administration. Vous pouvez vous déconnecter et essayer avec un autre compte.",
        variant: "destructive",
      });
      setLoading(false);
    } else if (initialized && !user) {
      // User is not logged in, stop loading
      setLoading(false);
    }
  }, [user, isAdmin, initialized, navigate, toast]);

  // If user is already logged in but not admin, show disconnect option
  if (initialized && user && !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-2xl font-bold text-primary">
              Accès refusé
            </CardTitle>
            <p className="text-center text-gray-600">
              Vous êtes connecté en tant que {user.email} mais vous n'avez pas les droits d'administration.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={handleSignOut}
              variant="outline"
              className="w-full"
            >
              Se déconnecter et essayer un autre compte
            </Button>
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
