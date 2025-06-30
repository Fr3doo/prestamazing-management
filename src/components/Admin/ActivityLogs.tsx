
import React from 'react';
import { useActivityLogs } from '@/hooks/useActivityLogs';
import ActivityLogsHeader from './ActivityLogs/ActivityLogsHeader';
import ActivityLogsFilters from './ActivityLogs/ActivityLogsFilters';
import ActivityLogsList from './ActivityLogs/ActivityLogsList';

const ActivityLogs = () => {
  const {
    filteredLogs,
    searchTerm,
    setSearchTerm,
    filterAction,
    setFilterAction,
    filterSeverity,
    setFilterSeverity,
  } = useActivityLogs();

  return (
    <div className="p-6 space-y-6">
      <ActivityLogsHeader filteredLogs={filteredLogs} />
      
      <ActivityLogsFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterAction={filterAction}
        setFilterAction={setFilterAction}
        filterSeverity={filterSeverity}
        setFilterSeverity={setFilterSeverity}
      />

      <ActivityLogsList filteredLogs={filteredLogs} />
    </div>
  );
};

export default ActivityLogs;
