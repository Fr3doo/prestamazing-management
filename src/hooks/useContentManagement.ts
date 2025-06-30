
import { useState, useCallback, useMemo } from 'react';
import { useContent } from './useContent';
import { useLoadingSpinner } from './useLoadingSpinner';
import { ContentSection } from '@/interfaces/repositories/IContentRepository';

export const useContentManagement = () => {
  const [editingSection, setEditingSection] = useState<ContentSection | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const {
    contentSections: allSections,
    loading,
    error,
    refetch
  } = useContent();

  const { LoadingComponent } = useLoadingSpinner({
    initialLoading: loading,
    spinnerText: 'Chargement du contenu...'
  });

  // Filter sections based on search term
  const sections = useMemo(() => {
    if (!searchTerm) return allSections;

    return allSections.filter(section =>
      section.section_key.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (section.title && section.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (section.content && section.content.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [allSections, searchTerm]);

  const handleFormSuccess = useCallback(() => {
    setShowForm(false);
    setEditingSection(null);
    refetch();
  }, [refetch]);

  const handleFormCancel = useCallback(() => {
    setShowForm(false);
    setEditingSection(null);
  }, []);

  const handleAddSection = useCallback(() => {
    setEditingSection(null);
    setShowForm(true);
  }, []);

  const handleEditSection = useCallback((section: ContentSection) => {
    setEditingSection(section);
    setShowForm(true);
  }, []);

  return {
    sections,
    editingSection,
    showForm,
    searchTerm,
    loading,
    error,
    LoadingComponent,
    setSearchTerm,
    handleFormSuccess,
    handleFormCancel,
    handleAddSection,
    handleEditSection,
  };
};
