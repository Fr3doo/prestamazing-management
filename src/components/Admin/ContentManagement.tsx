import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useStandardToast } from '@/hooks/useStandardToast';
import { Plus, Edit, Eye, EyeOff, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ContentForm from './ContentForm';
import { useLoadingSpinner } from '@/hooks/useLoadingSpinner';

interface ContentSection {
  id: string;
  section_key: string;
  title: string | null;
  content: string | null;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

const ContentManagement = () => {
  const [sections, setSections] = useState<ContentSection[]>([]);
  const [editingSection, setEditingSection] = useState<ContentSection | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { showError } = useStandardToast();

  const { loading, startLoading, stopLoading, LoadingComponent } = useLoadingSpinner({
    initialLoading: true,
    spinnerText: 'Chargement des sections...',
    fullScreen: false
  });

  useEffect(() => {
    fetchSections();
  }, []);

  const fetchSections = async () => {
    startLoading();
    try {
      const { data, error } = await supabase
        .from('content_sections')
        .select('*')
        .order('section_key', { ascending: true });

      if (error) throw error;
      setSections(data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des sections:', error);
      showError("Erreur", "Impossible de charger les sections de contenu");
    } finally {
      stopLoading();
    }
  };

  const handleFormSuccess = () => {
    setEditingSection(null);
    setShowForm(false);
    fetchSections();
  };

  const handleFormCancel = () => {
    setEditingSection(null);
    setShowForm(false);
  };

  const filteredSections = sections.filter(section => 
    section.section_key.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (section.title && section.title.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const truncateText = (text: string | null, maxLength: number = 100) => {
    if (!text) return '-';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  if (loading) {
    return (
      <div className="p-6">
        {LoadingComponent}
      </div>
    );
  }

  if (showForm) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            {editingSection ? 'Modifier la section' : 'Ajouter une section'}
          </h1>
        </div>
        <ContentForm
          section={editingSection}
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
            <h1 className="text-2xl font-bold text-gray-900">Gestion du contenu</h1>
            <p className="text-gray-600">Gérez le contenu de toutes les pages du site</p>
          </div>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Ajouter une section
          </Button>
        </div>

        <div className="flex gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Rechercher une section..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4">
        {filteredSections.map((section) => (
          <Card key={section.id}>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <CardTitle className="text-lg">{section.title || section.section_key}</CardTitle>
                    <Badge variant="outline">
                      {section.section_key}
                    </Badge>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditingSection(section);
                      setShowForm(true);
                    }}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Modifier
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 p-3 rounded-md">
                <p className="text-sm font-medium text-gray-700 mb-1">Contenu actuel:</p>
                <p className="text-sm text-gray-600">
                  {truncateText(section.content)}
                </p>
                {section.image_url && (
                  <div className="mt-2">
                    <p className="text-sm font-medium text-gray-700 mb-1">Image:</p>
                    <p className="text-sm text-gray-600">{section.image_url}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredSections.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">Aucune section trouvée</p>
        </div>
      )}
    </div>
  );
};

export default ContentManagement;
