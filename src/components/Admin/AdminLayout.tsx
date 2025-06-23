
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { signOut } = useAuth();
  const location = useLocation();

  const navItems = [
    { path: '/admin', label: 'Tableau de bord', exact: true },
    { path: '/admin/reviews', label: 'Avis clients' },
    { path: '/admin/partners', label: 'Partenaires' },
    { path: '/admin/content', label: 'Contenu' },
    { path: '/admin/contacts', label: 'Contacts' },
  ];

  const isActiveRoute = (path: string, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-8">
              <Link to="/" className="text-2xl font-montserrat font-bold">
                <span className="text-secondary">S</span>teve <span className="text-secondary">PREST'A</span>
              </Link>
              <nav className="hidden md:flex space-x-6">
                {navItems.map((item) => (
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
            </div>
            <Button onClick={signOut} variant="outline">
              Déconnexion
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
