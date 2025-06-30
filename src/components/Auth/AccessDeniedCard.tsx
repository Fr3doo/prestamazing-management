
import React from 'react';
import NonAdminMessage from './NonAdminMessage';

interface AccessDeniedCardProps {
  userEmail: string;
  onSignOut: () => Promise<void>;
}

const AccessDeniedCard = ({ userEmail, onSignOut }: AccessDeniedCardProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <NonAdminMessage 
        userEmail={userEmail} 
        onSignOut={onSignOut} 
      />
    </div>
  );
};

export default AccessDeniedCard;
