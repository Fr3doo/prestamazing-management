
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
    console.log('[AdminAuthControls] signOut called');
    signOut()
      .then(() => {
        console.log('[AdminAuthControls] signOut successful');
        navigate('/auth', { replace: true });
      })
      .catch(err => {
        console.error('[AdminAuthControls] signOut error', err);
      });
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
