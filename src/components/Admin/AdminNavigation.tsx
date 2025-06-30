
import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { useNavigation, NavigationItem } from '@/hooks/useNavigation';

interface AdminNavigationProps {
  items: NavigationItem[];
  className?: string;
}

const AdminNavigation = memo(({ items, className = '' }: AdminNavigationProps) => {
  const { navigationItems, isActiveRoute } = useNavigation({ items });

  return (
    <nav className={`hidden md:flex space-x-6 ${className}`}>
      {navigationItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            isActiveRoute(item.path, item.exact)
              ? 'bg-primary text-white'
              : 'text-gray-600 hover:text-primary'
          }`}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
});

AdminNavigation.displayName = 'AdminNavigation';

export default AdminNavigation;
