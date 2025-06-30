
import React from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAnalyticsData } from '@/hooks/useAnalyticsData';
import { exportAnalyticsData } from '@/utils/analyticsExport';
import AnalyticsStatsCards from './Analytics/AnalyticsStatsCards';
import AnalyticsCharts from './Analytics/AnalyticsCharts';
import AnalyticsReviewsTab from './Analytics/AnalyticsReviewsTab';
import AnalyticsActivityTab from './Analytics/AnalyticsActivityTab';

const Analytics = () => {
  const { data, loading } = useAnalyticsData();

  if (loading) {
    return <div className="p-6">Chargement des analytics...</div>;
  }

  if (!data) {
    return <div className="p-6">Erreur lors du chargement des données</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Analytics & Statistiques</h1>
          <p className="text-gray-600">Vue d'ensemble détaillée de votre activité</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={exportAnalyticsData} variant="outline">
            Exporter les données
          </Button>
        </div>
      </div>

      <AnalyticsStatsCards data={data} />

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="reviews">Analyse des avis</TabsTrigger>
          <TabsTrigger value="activity">Activité récente</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <AnalyticsCharts 
            monthlyData={data.monthlyData} 
            ratingDistribution={data.ratingDistribution} 
          />
        </TabsContent>

        <TabsContent value="reviews" className="space-y-4">
          <AnalyticsReviewsTab ratingDistribution={data.ratingDistribution} />
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <AnalyticsActivityTab activities={data.recentActivity} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Analytics;
