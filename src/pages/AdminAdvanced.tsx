
import React from 'react';
import BaseAdminPage from '@/components/Admin/BaseAdminPage';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Analytics from '@/components/Admin/Analytics';
import NotificationSystem from '@/components/Admin/NotificationSystem';
import DataBackup from '@/components/Admin/DataBackup';
import ActivityLogs from '@/components/Admin/ActivityLogs';
import SEOConfiguration from '@/components/Admin/SEOConfiguration';

const AdminAdvanced = () => {
  return (
    <BaseAdminPage
      title="Améliorations avancées"
      description="Outils avancés de gestion et d'analyse"
      breadcrumbs={[
        { label: 'Avancé' }
      ]}
    >
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
    </BaseAdminPage>
  );
};

export default AdminAdvanced;
