
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, Activity } from 'lucide-react';
import { ActivityLog } from '@/hooks/useActivityLogs';
import { exportLogs } from '@/utils/activityLogsUtils';

interface ActivityLogsHeaderProps {
  filteredLogs: ActivityLog[];
}

const ActivityLogsHeader = ({ filteredLogs }: ActivityLogsHeaderProps) => {
  const handleExport = () => {
    exportLogs(filteredLogs);
  };

  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Activity className="h-6 w-6" />
          Logs d'activité
        </h1>
        <p className="text-gray-600">Surveillez toutes les activités du système</p>
      </div>
      <Button onClick={handleExport} variant="outline">
        <Download className="h-4 w-4 mr-2" />
        Exporter
      </Button>
    </div>
  );
};

export default ActivityLogsHeader;
