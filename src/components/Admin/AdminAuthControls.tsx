
import React, { memo, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface AdminAuthControlsProps {
  className?: string;
}

const AdminAuthControls = memo(({ className = '' }: AdminAuthControlsProps) => {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = useCallback(() => {
    signOut();
    navigate('/auth', { replace: true });
  }, [signOut, navigate]);


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
