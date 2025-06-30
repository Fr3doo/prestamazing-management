
import { useState, useEffect } from 'react';
import { useStandardToast } from '@/hooks/useStandardToast';
import { useLoadingSpinner } from '@/hooks/useLoadingSpinner';
import { useRepositories } from '@/hooks/useRepositories';
import { ContactInfo } from '@/interfaces/repositories/IContactRepository';

export const useContactManagementWithRepository = () => {
  const [contacts, setContacts] = useState<ContactInfo[]>([]);
  const [editingContact, setEditingContact] = useState<ContactInfo | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const { showSuccess, showError } = useStandardToast();
  const { contactRepository } = useRepositories();

  const { loading, startLoading, stopLoading, LoadingComponent } = useLoadingSpinner({
    initialLoading: true,
    spinnerText: 'Chargement des contacts...',
    fullScreen: false
  });

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    startLoading();
    try {
      const data = await contactRepository.getAllContactInfo();
      setContacts(data);
    } catch (error) {
      console.error('Erreur lors du chargement des contacts:', error);
      showError("Erreur", "Impossible de charger les informations de contact");
    } finally {
      stopLoading();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette information de contact ?')) {
      return;
    }

    try {
      await contactRepository.deleteContactInfo(id);
      showSuccess("Succès", "Information de contact supprimée");
      fetchContacts();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      showError("Erreur", "Impossible de supprimer l'information de contact");
    }
  };

  const handleFormSuccess = () => {
    setEditingContact(null);
    setShowForm(false);
    fetchContacts();
  };

  const handleFormCancel = () => {
    setEditingContact(null);
    setShowForm(false);
  };

  const handleEdit = (contact: ContactInfo) => {
    setEditingContact(contact);
    setShowForm(true);
  };

  const handleAddContact = () => {
    setEditingContact(null);
    setShowForm(true);
  };

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = 
      contact.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.value.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (contact.label && contact.label.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFilter = filterType === 'all' || contact.type === filterType;
    
    return matchesSearch && matchesFilter;
  });

  const uniqueTypes = [...new Set(contacts.map(c => c.type))];

  return {
    contacts: filteredContacts,
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
  };
};
