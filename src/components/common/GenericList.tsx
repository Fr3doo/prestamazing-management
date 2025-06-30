
import React from 'react';

interface GenericListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  emptyMessage?: string;
  className?: string;
  itemClassName?: string;
  keyExtractor: (item: T) => string | number;
  renderHeader?: () => React.ReactNode;
  renderFooter?: () => React.ReactNode;
}

const GenericList = <T,>({
  items,
  renderItem,
  emptyMessage = "Aucun élément trouvé",
  className = "space-y-4",
  itemClassName,
  keyExtractor,
  renderHeader,
  renderFooter,
}: GenericListProps<T>) => {
  if (items.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={className}>
      {renderHeader?.()}
      
      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={keyExtractor(item)} className={itemClassName}>
            {renderItem(item, index)}
          </div>
        ))}
      </div>
      
      {renderFooter?.()}
    </div>
  );
};

export default GenericList;
