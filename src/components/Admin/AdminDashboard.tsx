
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, Users, Phone, FileText } from 'lucide-react';
import { useLoadingSpinner } from '@/hooks/useLoadingSpinner';
import BaseAdminPage from './BaseAdminPage';

interface Stats {
  reviews: number;
  partners: number;
  contacts: number;
  content: number;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<Stats>({
    reviews: 0,
    partners: 0,
    contacts: 0,
    content: 0,
  });

  const { loading, startLoading, stopLoading, LoadingComponent } = useLoadingSpinner({
    initialLoading: true,
    spinnerText: 'Chargement des statistiques...',
    fullScreen: false
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    startLoading();
    try {
      const [reviewsRes, partnersRes, contactsRes, contentRes] = await Promise.all([
        supabase.from('reviews').select('id', { count: 'exact', head: true }),
        supabase.from('partners_logos').select('id', { count: 'exact', head: true }),
        supabase.from('contact_info').select('id', { count: 'exact', head: true }),
        supabase.from('content_sections').select('id', { count: 'exact', head: true }),
      ]);

      setStats({
        reviews: reviewsRes.count || 0,
        partners: partnersRes.count || 0,
        contacts: contactsRes.count || 0,
        content: contentRes.count || 0,
      });
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
    } finally {
      stopLoading();
    }
  };

  const statsCards = [
    {
      title: 'Avis clients',
      value: stats.reviews,
      icon: MessageSquare,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Partenaires',
      value: stats.partners,
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Informations contact',
      value: stats.contacts,
      icon: Phone,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Sections de contenu',
      value: stats.content,
      icon: FileText,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

  const content = loading ? (
    LoadingComponent
  ) : (
    <>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {statsCards.map((card) => (
          <Card key={card.title}>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className={`p-2 rounded-lg ${card.bgColor}`}>
                  <card.icon className={`h-6 w-6 ${card.color}`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{card.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Actions rapides</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span>Gérer les avis clients</span>
                <MessageSquare className="h-5 w-5 text-gray-400" />
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span>Ajouter un partenaire</span>
                <Users className="h-5 w-5 text-gray-400" />
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span>Modifier les contacts</span>
                <Phone className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Activité récente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="text-sm text-gray-600">
                Interface d'administration configurée avec succès
              </div>
              <div className="text-sm text-gray-600">
                Base de données initialisée
              </div>
              <div className="text-sm text-gray-600">
                Buckets de stockage créés
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );

  return (
    <BaseAdminPage
      title="Tableau de bord"
      description="Vue d'ensemble de votre contenu"
    >
      {content}
    </BaseAdminPage>
  );
};

export default AdminDashboard;
