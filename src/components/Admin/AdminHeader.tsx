
import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { NavigationItem } from '@/hooks/useNavigation';
import AdminNavigation from './AdminNavigation';
import AdminAuthControls from './AdminAuthControls';

interface AdminHeaderProps {
  navigationItems: NavigationItem[];
}

const AdminHeader = memo(({ navigationItems }: AdminHeaderProps) => {
  return (
    <header className="bg-white border-b">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-2xl font-montserrat font-bold">
              <span className="text-secondary">S</span>teve <span className="text-secondary">PREST'A</span>
            </Link>
            <AdminNavigation items={navigationItems} />
          </div>
          <AdminAuthControls />
        </div>
      </div>
    </header>
  );
});

AdminHeader.displayName = 'AdminHeader';

export default AdminHeader;
