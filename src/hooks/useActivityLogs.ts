
import { useState, useEffect } from 'react';

export interface ActivityLog {
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

export const useActivityLogs = () => {
  const [logs] = useState<ActivityLog[]>([
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

  return {
    logs,
    filteredLogs,
    searchTerm,
    setSearchTerm,
    filterAction,
    setFilterAction,
    filterSeverity,
    setFilterSeverity,
  };
};
