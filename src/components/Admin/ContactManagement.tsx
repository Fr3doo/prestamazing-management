
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import ContactInfoForm from './ContactInfoForm';

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
  const [loading, setLoading] = useState(true);
  const [editingContact, setEditingContact] = useState<ContactInfo | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const { toast } = useToast();

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const { data, error } = await supabase
        .from('contact_info')
        .select('*')
        .order('type', { ascending: true });

      if (error) throw error;
      setContacts(data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des contacts:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les informations de contact",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
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

      toast({
        title: "Succès",
        description: "Information de contact supprimée",
      });

      fetchContacts();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'information de contact",
        variant: "destructive",
      });
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

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = 
      contact.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.value.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (contact.label && contact.label.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFilter = filterType === 'all' || contact.type === filterType;
    
    return matchesSearch && matchesFilter;
  });

  const getTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      'phone': 'bg-blue-100 text-blue-800',
      'email': 'bg-green-100 text-green-800',
      'address': 'bg-purple-100 text-purple-800',
      'hours': 'bg-orange-100 text-orange-800',
      'social': 'bg-pink-100 text-pink-800',
      'zone': 'bg-yellow-100 text-yellow-800',
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const uniqueTypes = [...new Set(contacts.map(c => c.type))];

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center">Chargement des contacts...</div>
      </div>
    );
  }

  if (showForm) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            {editingContact ? 'Modifier le contact' : 'Ajouter un contact'}
          </h1>
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
    <div className="p-6">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestion des contacts</h1>
            <p className="text-gray-600">Gérez les informations de contact, horaires et zones d'intervention</p>
          </div>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Ajouter un contact
          </Button>
        </div>

        <div className="flex gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="all">Tous les types</option>
            {uniqueTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-4">
        {filteredContacts.map((contact) => (
          <Card key={contact.id}>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <CardTitle className="text-lg">
                      {contact.label || contact.type}
                    </CardTitle>
                    <Badge className={getTypeColor(contact.type)}>
                      {contact.type}
                    </Badge>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditingContact(contact);
                      setShowForm(true);
                    }}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Modifier
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(contact.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Supprimer
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 p-3 rounded-md">
                <p className="text-sm font-medium text-gray-700 mb-1">Valeur:</p>
                <p className="text-sm text-gray-900 whitespace-pre-wrap">
                  {contact.value}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredContacts.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">Aucune information de contact trouvée</p>
        </div>
      )}
    </div>
  );
};

export default ContactManagement;
