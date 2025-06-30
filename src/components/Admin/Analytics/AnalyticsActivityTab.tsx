
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from 'lucide-react';

interface Activity {
  type: string;
  description: string;
  timestamp: string;
}

interface AnalyticsActivityTabProps {
  activities: Activity[];
}

const AnalyticsActivityTab = ({ activities }: AnalyticsActivityTabProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Activité récente</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity, index) => (
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
  );
};

export default AnalyticsActivityTab;
