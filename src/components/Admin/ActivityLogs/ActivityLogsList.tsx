
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, User } from 'lucide-react';
import { ActivityLog } from '@/hooks/useActivityLogs';
import { getSeverityColor, getActionIcon } from '@/utils/activityLogsUtils';

interface ActivityLogsListProps {
  filteredLogs: ActivityLog[];
}

const ActivityLogsList = ({ filteredLogs }: ActivityLogsListProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Activités récentes ({filteredLogs.length} entrées)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredLogs.map((log) => (
            <div key={log.id} className="border rounded-lg p-4 hover:bg-gray-50">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {getActionIcon(log.action)}
                    <span className="font-medium">{log.action}</span>
                    <Badge variant="outline">{log.resource}</Badge>
                    <Badge className={getSeverityColor(log.severity)}>
                      {log.severity}
                    </Badge>
                  </div>
                  
                  <p className="text-gray-800 mb-2">{log.details}</p>
                  
                  <div className="text-sm text-gray-500 space-y-1">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {log.timestamp.toLocaleString('fr-FR')}
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {log.user}
                      </span>
                      <span>IP: {log.ip_address}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {filteredLogs.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Aucune activité trouvée avec les filtres actuels
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityLogsList;
