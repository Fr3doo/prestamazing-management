
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Search, Filter, Download, Activity, User, Settings, Database } from 'lucide-react';

interface ActivityLog {
  id: string;
  timestamp: Date;
  user: string;
  action: string;
  resource: string;
  details: string;
  ip_address: string;
  user_agent: string;
  severity: 'info' | 'warning' | 'error' | 'success';
}

const ActivityLogs = () => {
  const [logs, setLogs] = useState<ActivityLog[]>([
    {
      id: '1',
      timestamp: new Date(),
      user: 'admin@example.com',
      action: 'CREATE',
      resource: 'review',
      details: 'Nouvel avis créé par Jean D.',
      ip_address: '192.168.1.1',
      user_agent: 'Mozilla/5.0...',
      severity: 'success'
    },
    {
      id: '2',
      timestamp: new Date(Date.now() - 3600000),
      user: 'admin@example.com',
      action: 'UPDATE',
      resource: 'contact_info',
      details: 'Information de contact mise à jour',
      ip_address: '192.168.1.1',
      user_agent: 'Mozilla/5.0...',
      severity: 'info'
    },
    {
      id: '3',
      timestamp: new Date(Date.now() - 7200000),
      user: 'admin@example.com',
      action: 'DELETE',
      resource: 'partner',
      details: 'Partenaire supprimé: Ancien Restaurant',
      ip_address: '192.168.1.1',
      user_agent: 'Mozilla/5.0...',
      severity: 'warning'
    },
    {
      id: '4',
      timestamp: new Date(Date.now() - 10800000),
      user: 'system',
      action: 'BACKUP',
      resource: 'database',
      details: 'Sauvegarde automatique réalisée',
      ip_address: 'localhost',
      user_agent: 'System',
      severity: 'info'
    }
  ]);

  const [filteredLogs, setFilteredLogs] = useState<ActivityLog[]>(logs);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAction, setFilterAction] = useState('all');
  const [filterSeverity, setFilterSeverity] = useState('all');

  useEffect(() => {
    let filtered = logs;

    if (searchTerm) {
      filtered = filtered.filter(log =>
        log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.resource.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.details.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterAction !== 'all') {
      filtered = filtered.filter(log => log.action === filterAction);
    }

    if (filterSeverity !== 'all') {
      filtered = filtered.filter(log => log.severity === filterSeverity);
    }

    setFilteredLogs(filtered);
  }, [searchTerm, filterAction, filterSeverity, logs]);

  const exportLogs = () => {
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

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'success': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'CREATE': return <Database className="h-4 w-4 text-green-600" />;
      case 'UPDATE': return <Settings className="h-4 w-4 text-blue-600" />;
      case 'DELETE': return <Activity className="h-4 w-4 text-red-600" />;
      case 'LOGIN': return <User className="h-4 w-4 text-purple-600" />;
      default: return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Activity className="h-6 w-6" />
            Logs d'activité
          </h1>
          <p className="text-gray-600">Surveillez toutes les activités du système</p>
        </div>
        <Button onClick={exportLogs} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Exporter
        </Button>
      </div>

      {/* Filtres et recherche */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtres
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher dans les logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={filterAction} onValueChange={setFilterAction}>
              <SelectTrigger>
                <SelectValue placeholder="Action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les actions</SelectItem>
                <SelectItem value="CREATE">CREATE</SelectItem>
                <SelectItem value="UPDATE">UPDATE</SelectItem>
                <SelectItem value="DELETE">DELETE</SelectItem>
                <SelectItem value="LOGIN">LOGIN</SelectItem>
                <SelectItem value="BACKUP">BACKUP</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterSeverity} onValueChange={setFilterSeverity}>
              <SelectTrigger>
                <SelectValue placeholder="Sévérité" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les sévérités</SelectItem>
                <SelectItem value="info">Info</SelectItem>
                <SelectItem value="success">Succès</SelectItem>
                <SelectItem value="warning">Avertissement</SelectItem>
                <SelectItem value="error">Erreur</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Liste des logs */}
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
    </div>
  );
};

export default ActivityLogs;
