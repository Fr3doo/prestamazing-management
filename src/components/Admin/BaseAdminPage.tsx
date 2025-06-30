
import React from 'react';
import AdminLayout from './AdminLayout';
import withAdminProtection from './withAdminProtection';
import AdminPageLayout from './AdminPageLayout';

interface BaseAdminPageProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  breadcrumbs?: Array<{ label: string; href?: string }>;
}

const BaseAdminPage = ({ 
  title, 
  description, 
  children, 
  actions,
  breadcrumbs 
}: BaseAdminPageProps) => {
  return (
    <AdminLayout>
      <AdminPageLayout
        title={title}
        description={description}
        actions={actions}
        breadcrumbs={breadcrumbs}
      >
        {children}
      </AdminPageLayout>
    </AdminLayout>
  );
};

export default withAdminProtection(BaseAdminPage);
