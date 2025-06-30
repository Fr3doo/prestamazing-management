
import { ActivityLog } from '@/hooks/useActivityLogs';
import { Database, Settings, Activity, User } from 'lucide-react';

export const exportLogs = (filteredLogs: ActivityLog[]) => {
  const csvContent = "data:text/csv;charset=utf-8," 
    + "Timestamp,User,Action,Resource,Details,IP Address,Severity\n"
    + filteredLogs.map(log => 
        `"${log.timestamp.toISOString()}","${log.user}","${log.action}","${log.resource}","${log.details.replace(/"/g, '""')}","${log.ip_address}","${log.severity}"`
      ).join("\n");

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `activity-logs-${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'success': return 'bg-green-100 text-green-800';
    case 'warning': return 'bg-yellow-100 text-yellow-800';
    case 'error': return 'bg-red-100 text-red-800';
    default: return 'bg-blue-100 text-blue-800';
  }
};

export const getActionIcon = (action: string) => {
  switch (action) {
    case 'CREATE': return <Database className="h-4 w-4 text-green-600" />;
    case 'UPDATE': return <Settings className="h-4 w-4 text-blue-600" />;
    case 'DELETE': return <Activity className="h-4 w-4 text-red-600" />;
    case 'LOGIN': return <User className="h-4 w-4 text-purple-600" />;
    default: return <Activity className="h-4 w-4 text-gray-600" />;
  }
};
