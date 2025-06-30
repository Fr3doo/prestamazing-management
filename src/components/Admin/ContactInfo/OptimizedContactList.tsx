
import React from 'react';
import SearchableList from '@/components/common/SearchableList';
import ComposableCard from '@/components/common/ComposableCard';
import { contactTypes } from './contactTypes';

interface ContactInfo {
  id: string;
  type: string;
  value: string;
  label: string | null;
  created_at: string;
  updated_at: string;
}

interface OptimizedContactListProps {
  contacts: ContactInfo[];
  onEdit: (contact: ContactInfo) => void;
  onDelete: (id: string) => void;
}

const OptimizedContactList = ({ contacts, onEdit, onDelete }: OptimizedContactListProps) => {
  const filterOptions = contactTypes.map(type => ({
    label: type.label,
    value: type.value,
    filterFn: (contact: ContactInfo) => contact.type === type.value
  }));

  const renderContactItem = (contact: ContactInfo) => {
    const typeLabel = contactTypes.find(t => t.value === contact.type)?.label || contact.type;
    
    return (
      <ComposableCard
        title={contact.label || typeLabel}
        actions={[
          {
            label: 'Modifier',
            onClick: () => onEdit(contact),
            variant: 'outline'
          },
          {
            label: 'Supprimer',
            onClick: () => onDelete(contact.id),
            variant: 'destructive'
          }
        ]}
      >
        <div className="space-y-2">
          <p className="text-sm text-gray-600">
            <span className="font-medium">Type:</span> {typeLabel}
          </p>
          <p className="text-sm">
            <span className="font-medium">Valeur:</span> {contact.value}
          </p>
          {contact.label && (
            <p className="text-sm text-gray-600">
              <span className="font-medium">Libellé:</span> {contact.label}
            </p>
          )}
        </div>
      </ComposableCard>
    );
  };

  return (
    <SearchableList
      items={contacts}
      renderItem={renderContactItem}
      searchFields={['type', 'value', 'label']}
      filterOptions={filterOptions}
      keyExtractor={(contact) => contact.id}
      emptyMessage="Aucune information de contact trouvée"
      searchPlaceholder="Rechercher dans les contacts..."
    />
  );
};

export default OptimizedContactList;
