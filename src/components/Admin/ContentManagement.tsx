
import React, { memo } from 'react';
import { useContentManagement } from '@/hooks/useContentManagement';
import ContentHeader from './ContentHeader';
import ContentSearchFilter from './ContentSearchFilter';
import ContentList from './ContentList';
import ContentFormWrapper from './Content/ContentFormWrapper';

const ContentManagement = memo(() => {
  const {
    sections,
    editingSection,
    showForm,
    searchTerm,
    loading,
    LoadingComponent,
    setSearchTerm,
    handleFormSuccess,
    handleFormCancel,
    handleAddSection,
    handleEditSection,
  } = useContentManagement();

  if (loading) {
    return LoadingComponent;
  }

  if (showForm) {
    return (
      <ContentFormWrapper
        editingSection={editingSection}
        onSuccess={handleFormSuccess}
        onCancel={handleFormCancel}
      />
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
        sections={sections}
        onEditSection={handleEditSection}
      />
    </div>
  );
});

ContentManagement.displayName = 'ContentManagement';

export default ContentManagement;
