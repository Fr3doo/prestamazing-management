
import React from 'react';
import { useContactManagement } from '@/hooks/useContactManagement';
import ContactHeader from './ContactInfo/ContactHeader';
import ContactSearchFilter from './ContactInfo/ContactSearchFilter';
import ContactList from './ContactInfo/ContactList';
import ContactFormWrapper from './ContactInfo/ContactFormWrapper';

const ContactManagement = () => {
  const {
    contacts,
    editingContact,
    showForm,
    searchTerm,
    filterType,
    uniqueTypes,
    loading,
    LoadingComponent,
    setSearchTerm,
    setFilterType,
    handleDelete,
    handleEdit,
    handleAddContact,
    handleFormSuccess,
    handleFormCancel,
  } = useContactManagement();

  if (loading) {
    return LoadingComponent;
  }

  if (showForm) {
    return (
      <ContactFormWrapper
        editingContact={editingContact}
        onSuccess={handleFormSuccess}
        onCancel={handleFormCancel}
      />
    );
  }

  return (
    <div>
      <ContactHeader onAddContact={handleAddContact} />
      
      <ContactSearchFilter
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filterType={filterType}
        onFilterChange={setFilterType}
        uniqueTypes={uniqueTypes}
      />

      <ContactList
        contacts={contacts}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default ContactManagement;
