
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface NonAdminMessageProps {
  userEmail: string;
  onSignOut: () => Promise<void>;
}

const NonAdminMessage = ({ userEmail, onSignOut }: NonAdminMessageProps) => {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-center text-2xl font-bold text-primary">
          Accès refusé
        </CardTitle>
        <p className="text-center text-gray-600">
          Vous êtes connecté en tant que {userEmail} mais vous n'avez pas les droits d'administration.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={onSignOut}
          variant="outline"
          className="w-full"
        >
          Se déconnecter et essayer un autre compte
        </Button>
      </CardContent>
    </Card>
  );
};

export default NonAdminMessage;
