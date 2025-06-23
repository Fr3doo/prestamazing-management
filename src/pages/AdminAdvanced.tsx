
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import AdminLayout from '@/components/Admin/AdminLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Analytics from '@/components/Admin/Analytics';
import NotificationSystem from '@/components/Admin/NotificationSystem';
import DataBackup from '@/components/Admin/DataBackup';
import ActivityLogs from '@/components/Admin/ActivityLogs';
import SEOConfiguration from '@/components/Admin/SEOConfiguration';

const AdminAdvanced = () => {
  const { user, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Chargement...</div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Améliorations avancées</h1>
          <p className="text-gray-600">Outils avancés de gestion et d'analyse</p>
        </div>

        <Tabs defaultValue="analytics" className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="backup">Sauvegarde</TabsTrigger>
            <TabsTrigger value="logs">Logs</TabsTrigger>
            <TabsTrigger value="seo">SEO</TabsTrigger>
          </TabsList>

          <TabsContent value="analytics">
            <Analytics />
          </TabsContent>

          <TabsContent value="notifications">
            <NotificationSystem />
          </TabsContent>

          <TabsContent value="backup">
            <DataBackup />
          </TabsContent>

          <TabsContent value="logs">
            <ActivityLogs />
          </TabsContent>

          <TabsContent value="seo">
            <SEOConfiguration />
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminAdvanced;
