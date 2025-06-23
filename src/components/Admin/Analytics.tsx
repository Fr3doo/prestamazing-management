
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, MessageSquare, Calendar, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DatePickerWithRange } from '@/components/ui/date-picker';
import { DateRange } from 'react-day-picker';

interface AnalyticsData {
  totalViews: number;
  totalContacts: number;
  totalReviews: number;
  avgRating: number;
  monthlyData: Array<{ month: string; contacts: number; reviews: number }>;
  ratingDistribution: Array<{ rating: number; count: number }>;
  recentActivity: Array<{ type: string; description: string; timestamp: string }>;
}

const Analytics = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      
      // Récupération des données de base
      const [reviewsRes, contactsRes] = await Promise.all([
        supabase.from('reviews').select('*'),
        supabase.from('contact_info').select('*')
      ]);

      const reviews = reviewsRes.data || [];
      const contacts = contactsRes.data || [];

      // Calcul des moyennes et statistiques
      const avgRating = reviews.length > 0 
        ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
        : 0;

      // Distribution des notes
      const ratingDistribution = [1, 2, 3, 4, 5].map(rating => ({
        rating,
        count: reviews.filter(r => r.rating === rating).length
      }));

      // Données mensuelles simulées (en production, vous pourriez avoir des vues réelles)
      const monthlyData = [
        { month: 'Jan', contacts: 12, reviews: 8 },
        { month: 'Fév', contacts: 19, reviews: 12 },
        { month: 'Mar', contacts: 15, reviews: 10 },
        { month: 'Avr', contacts: 22, reviews: 15 },
        { month: 'Mai', contacts: 28, reviews: 18 },
        { month: 'Jun', contacts: 25, reviews: 20 }
      ];

      // Activité récente simulée
      const recentActivity = [
        { type: 'review', description: 'Nouvel avis client ajouté', timestamp: new Date().toISOString() },
        { type: 'contact', description: 'Information de contact mise à jour', timestamp: new Date(Date.now() - 3600000).toISOString() },
        { type: 'content', description: 'Section de contenu modifiée', timestamp: new Date(Date.now() - 7200000).toISOString() }
      ];

      setData({
        totalViews: 1250, // Simulé
        totalContacts: contacts.length,
        totalReviews: reviews.length,
        avgRating,
        monthlyData,
        ratingDistribution,
        recentActivity
      });
    } catch (error) {
      console.error('Erreur lors du chargement des analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportData = async () => {
    try {
      const { data: allData } = await supabase.from('reviews').select('*');
      
      const csvContent = "data:text/csv;charset=utf-8," 
        + "Nom,Note,Commentaire,Date\n"
        + (allData || []).map(row => 
            `"${row.user_name}","${row.rating}","${row.comment.replace(/"/g, '""')}","${row.created_at}"`
          ).join("\n");

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `analytics-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Erreur lors de l\'export:', error);
    }
  };

  if (loading) {
    return <div className="p-6">Chargement des analytics...</div>;
  }

  if (!data) {
    return <div className="p-6">Erreur lors du chargement des données</div>;
  }

  const chartConfig = {
    contacts: { label: "Contacts", color: "#3b82f6" },
    reviews: { label: "Avis", color: "#10b981" }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Analytics & Statistiques</h1>
          <p className="text-gray-600">Vue d'ensemble détaillée de votre activité</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={exportData} variant="outline">
            Exporter les données
          </Button>
        </div>
      </div>

      {/* Cartes de statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Vues totales</p>
                <p className="text-2xl font-bold">{data.totalViews}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total contacts</p>
                <p className="text-2xl font-bold">{data.totalContacts}</p>
              </div>
              <Users className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total avis</p>
                <p className="text-2xl font-bold">{data.totalReviews}</p>
              </div>
              <MessageSquare className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Note moyenne</p>
                <p className="text-2xl font-bold">{data.avgRating.toFixed(1)}/5</p>
              </div>
              <Activity className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="reviews">Analyse des avis</TabsTrigger>
          <TabsTrigger value="activity">Activité récente</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Évolution mensuelle</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data.monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line type="monotone" dataKey="contacts" stroke="#3b82f6" strokeWidth={2} />
                      <Line type="monotone" dataKey="reviews" stroke="#10b981" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Distribution des notes</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.ratingDistribution}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="rating" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="count" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reviews" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Analyse détaillée des avis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">{data.ratingDistribution.filter(r => r.rating >= 4).reduce((sum, r) => sum + r.count, 0)}</div>
                  <div className="text-sm text-gray-600">Avis positifs (4-5⭐)</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-600">{data.ratingDistribution.find(r => r.rating === 3)?.count || 0}</div>
                  <div className="text-sm text-gray-600">Avis neutres (3⭐)</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-600">{data.ratingDistribution.filter(r => r.rating <= 2).reduce((sum, r) => sum + r.count, 0)}</div>
                  <div className="text-sm text-gray-600">Avis négatifs (1-2⭐)</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Activité récente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <div className="flex-1">
                      <p className="font-medium">{activity.description}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(activity.timestamp).toLocaleString('fr-FR')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Analytics;
