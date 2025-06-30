
import React, { memo } from 'react';
import { NavigationItem } from '@/hooks/useNavigation';
import { defaultAdminNavigation } from '@/config/adminNavigation';
import AdminHeader from './AdminHeader';

interface AdminLayoutProps {
  children: React.ReactNode;
  navigationItems?: NavigationItem[];
}

const AdminLayout = memo(({ 
  children, 
  navigationItems = defaultAdminNavigation 
}: AdminLayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader navigationItems={navigationItems} />
      <main className="container mx-auto">
        {children}
      </main>
    </div>
  );
});

AdminLayout.displayName = 'AdminLayout';

export default AdminLayout;
