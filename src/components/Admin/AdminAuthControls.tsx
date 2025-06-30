
import React, { memo, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';

interface AdminAuthControlsProps {
  className?: string;
}

const AdminAuthControls = memo(({ className = '' }: AdminAuthControlsProps) => {
  const { signOut } = useAuth();

  const handleSignOut = useCallback(() => {
    signOut();
  }, [signOut]);

  return (
    <div className={className}>
      <Button onClick={handleSignOut} variant="outline">
        Déconnexion
      </Button>
    </div>
  );
});

AdminAuthControls.displayName = 'AdminAuthControls';

export default AdminAuthControls;
