
import React, { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import GenericList from './GenericList';

interface SearchableListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  searchFields: Array<keyof T>;
  filterOptions?: Array<{
    label: string;
    value: string;
    filterFn: (item: T) => boolean;
  }>;
  keyExtractor: (item: T) => string | number;
  emptyMessage?: string;
  searchPlaceholder?: string;
  className?: string;
}

const SearchableList = <T,>({
  items,
  renderItem,
  searchFields,
  filterOptions,
  keyExtractor,
  emptyMessage = "Aucun élément trouvé",
  searchPlaceholder = "Rechercher...",
  className
}: SearchableListProps<T>) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterValue, setFilterValue] = useState('all');

  const filteredItems = useMemo(() => {
    let filtered = items;

    // Apply search filter
    if (searchTerm.trim()) {
      filtered = filtered.filter(item =>
        searchFields.some(field => {
          const value = item[field];
          return value && String(value).toLowerCase().includes(searchTerm.toLowerCase());
        })
      );
    }

    // Apply category filter
    if (filterValue !== 'all' && filterOptions) {
      const selectedFilter = filterOptions.find(option => option.value === filterValue);
      if (selectedFilter) {
        filtered = filtered.filter(selectedFilter.filterFn);
      }
    }

    return filtered;
  }, [items, searchTerm, filterValue, searchFields, filterOptions]);

  return (
    <div className={className}>
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <Input
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        
        {filterOptions && (
          <div className="sm:w-48">
            <Select value={filterValue} onValueChange={setFilterValue}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrer par..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous</SelectItem>
                {filterOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      <GenericList
        items={filteredItems}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        emptyMessage={emptyMessage}
      />
    </div>
  );
};

export default SearchableList;
