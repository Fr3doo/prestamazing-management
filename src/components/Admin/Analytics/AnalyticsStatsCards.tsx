
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, Users, MessageSquare, Activity } from 'lucide-react';

interface AnalyticsData {
  totalViews: number;
  totalContacts: number;
  totalReviews: number;
  avgRating: number;
}

interface AnalyticsStatsCardsProps {
  data: AnalyticsData;
}

const AnalyticsStatsCards = ({ data }: AnalyticsStatsCardsProps) => {
  const statsCards = [
    {
      title: 'Vues totales',
      value: data.totalViews,
      icon: TrendingUp,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Total contacts',
      value: data.totalContacts,
      icon: Users,
      color: 'text-green-500',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Total avis',
      value: data.totalReviews,
      icon: MessageSquare,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Note moyenne',
      value: `${data.avgRating.toFixed(1)}/5`,
      icon: Activity,
      color: 'text-orange-500',
      bgColor: 'bg-orange-50',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statsCards.map((card) => (
        <Card key={card.title}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{card.title}</p>
                <p className="text-2xl font-bold">{card.value}</p>
              </div>
              <card.icon className={`h-8 w-8 ${card.color}`} />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AnalyticsStatsCards;
