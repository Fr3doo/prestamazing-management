
import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

interface AdminPageLayoutProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  breadcrumbs?: Array<{ label: string; href?: string }>;
}

const AdminPageLayout = ({ 
  title, 
  description, 
  children, 
  actions,
  breadcrumbs 
}: AdminPageLayoutProps) => {
  return (
    <div className="p-6">
      {/* Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="mb-4" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 text-sm text-gray-500">
            <li>
              <Link to="/admin" className="hover:text-primary flex items-center">
                <Home className="h-4 w-4" />
              </Link>
            </li>
            {breadcrumbs.map((breadcrumb, index) => (
              <li key={index} className="flex items-center">
                <ChevronRight className="h-4 w-4 mx-2" />
                {breadcrumb.href ? (
                  <Link to={breadcrumb.href} className="hover:text-primary">
                    {breadcrumb.label}
                  </Link>
                ) : (
                  <span className="text-gray-900 font-medium">{breadcrumb.label}</span>
                )}
              </li>
            ))}
          </ol>
        </nav>
      )}

      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            {description && (
              <p className="text-gray-600 mt-1">{description}</p>
            )}
          </div>
          {actions && (
            <div className="flex gap-2">
              {actions}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      {children}
    </div>
  );
};

export default AdminPageLayout;
