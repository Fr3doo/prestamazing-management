
import { useState, useCallback, useMemo } from 'react';
import { useContacts } from './useContacts';
import { useLoadingSpinner } from './useLoadingSpinner';
import { useStandardToast } from './useStandardToast';
import { useErrorHandler } from './useErrorHandler';
import { ContactInfo } from '@/interfaces/repositories/IContactRepository';

export const useContactManagement = () => {
  const [editingContact, setEditingContact] = useState<ContactInfo | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('');

  const {
    contactInfo: allContacts,
    loading,
    error,
    refetch,
    deleteContactInfo: deleteContactBase
  } = useContacts();

  const { showSuccess } = useStandardToast();
  const { handleError } = useErrorHandler();
  const { LoadingComponent } = useLoadingSpinner({
    initialLoading: loading,
    spinnerText: 'Chargement des contacts...'
  });

  // Filter contacts based on search term and type
  const contacts = useMemo(() => {
    let filtered = allContacts;

    if (searchTerm) {
      filtered = filtered.filter(contact =>
        contact.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.value.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (contact.label && contact.label.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (filterType) {
      filtered = filtered.filter(contact => contact.type === filterType);
    }

    return filtered;
  }, [allContacts, searchTerm, filterType]);

  // Get unique types for filter dropdown
  const uniqueTypes = useMemo(() => {
    const types = new Set(allContacts.map(contact => contact.type));
    return Array.from(types).sort();
  }, [allContacts]);

  const handleDelete = useCallback(async (id: string) => {
    try {
      await deleteContactBase(id);
      showSuccess('Contact supprimé', 'Le contact a été supprimé avec succès.');
    } catch (error) {
      handleError(error, {
        title: 'Erreur de suppression',
        logContext: 'Contact deletion'
      });
    }
  }, [deleteContactBase, showSuccess, handleError]);

  const handleEdit = useCallback((contact: ContactInfo) => {
    setEditingContact(contact);
    setShowForm(true);
  }, []);

  const handleAddContact = useCallback(() => {
    setEditingContact(null);
    setShowForm(true);
  }, []);

  const handleFormSuccess = useCallback(() => {
    setShowForm(false);
    setEditingContact(null);
    refetch();
  }, [refetch]);

  const handleFormCancel = useCallback(() => {
    setShowForm(false);
    setEditingContact(null);
  }, []);

  return {
    contacts,
    editingContact,
    showForm,
    searchTerm,
    filterType,
    uniqueTypes,
    loading,
    error,
    LoadingComponent,
    setSearchTerm,
    setFilterType,
    handleDelete,
    handleEdit,
    handleAddContact,
    handleFormSuccess,
    handleFormCancel,
  };
};
