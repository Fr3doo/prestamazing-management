
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useStandardToast } from '@/hooks/useStandardToast';
import ContentForm from './ContentForm';
import ContentHeader from './ContentHeader';
import ContentSearchFilter from './ContentSearchFilter';
import ContentList from './ContentList';
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

  const handleAddSection = () => {
    setEditingSection(null);
    setShowForm(true);
  };

  const handleEditSection = (section: ContentSection) => {
    setEditingSection(section);
    setShowForm(true);
  };

  const filteredSections = sections.filter(section => 
    section.section_key.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (section.title && section.title.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return LoadingComponent;
  }

  if (showForm) {
    return (
      <div>
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            {editingSection ? 'Modifier la section' : 'Ajouter une section'}
          </h2>
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
    <div>
      <ContentHeader onAddSection={handleAddSection} />
      <ContentSearchFilter 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />
      <ContentList 
        sections={filteredSections}
        onEditSection={handleEditSection}
      />
    </div>
  );
};

export default ContentManagement;
