
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useStandardToast } from '@/hooks/useStandardToast';
import { useLoadingSpinner } from '@/hooks/useLoadingSpinner';
import ContactInfoForm from './ContactInfo/ContactInfoForm';
import ContactHeader from './ContactInfo/ContactHeader';
import ContactSearchFilter from './ContactInfo/ContactSearchFilter';
import ContactList from './ContactInfo/ContactList';

interface ContactInfo {
  id: string;
  type: string;
  value: string;
  label: string | null;
  created_at: string;
  updated_at: string;
}

const ContactManagement = () => {
  const [contacts, setContacts] = useState<ContactInfo[]>([]);
  const [editingContact, setEditingContact] = useState<ContactInfo | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const { showSuccess, showError } = useStandardToast();

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
      const { data, error } = await supabase
        .from('contact_info')
        .select('*')
        .order('type', { ascending: true });

      if (error) throw error;
      setContacts(data || []);
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
      const { error } = await supabase
        .from('contact_info')
        .delete()
        .eq('id', id);

      if (error) throw error;
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

  if (loading) {
    return LoadingComponent;
  }

  if (showForm) {
    return (
      <div>
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            {editingContact ? 'Modifier le contact' : 'Ajouter un contact'}
          </h2>
        </div>
        <ContactInfoForm
          contact={editingContact}
          onSuccess={handleFormSuccess}
          onCancel={handleFormCancel}
        />
      </div>
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
        contacts={filteredContacts}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default ContactManagement;
