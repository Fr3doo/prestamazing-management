
import React from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface ContactSearchFilterProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filterType: string;
  onFilterChange: (value: string) => void;
  uniqueTypes: string[];
}

const ContactSearchFilter = ({
  searchTerm,
  onSearchChange,
  filterType,
  onFilterChange,
  uniqueTypes,
}: ContactSearchFilterProps) => {
  return (
    <div className="flex gap-4 mb-6">
      <div className="flex-1">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
      <select
        value={filterType}
        onChange={(e) => onFilterChange(e.target.value)}
        className="px-3 py-2 border border-gray-300 rounded-md"
      >
        <option value="all">Tous les types</option>
        {uniqueTypes.map(type => (
          <option key={type} value={type}>{type}</option>
        ))}
      </select>
    </div>
  );
};

export default ContactSearchFilter;
