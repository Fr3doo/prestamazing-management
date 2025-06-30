
import { useState, useCallback } from 'react';
import { usePartners } from './usePartners';
import { useStandardToast } from './useStandardToast';
import { useErrorHandler } from './useErrorHandler';
import { Partner } from '@/interfaces/repositories/IPartnerRepository';

export { Partner } from '@/interfaces/repositories/IPartnerRepository';

export const usePartnersManagement = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);

  const {
    partners,
    loading,
    error,
    refetch,
    deletePartner: deletePartnerBase,
    updatePartnerOrder: updatePartnerOrderBase
  } = usePartners();

  const { showSuccess } = useStandardToast();
  const { handleError } = useErrorHandler();

  const handleAdd = useCallback(() => {
    setEditingPartner(null);
    setShowForm(true);
  }, []);

  const handleEdit = useCallback((partner: Partner) => {
    setEditingPartner(partner);
    setShowForm(true);
  }, []);

  const handleDelete = useCallback(async (id: string) => {
    try {
      await deletePartnerBase(id);
      showSuccess('Partenaire supprimé', 'Le partenaire a été supprimé avec succès.');
    } catch (error) {
      handleError(error, {
        title: 'Erreur de suppression',
        logContext: 'Partner deletion'
      });
    }
  }, [deletePartnerBase, showSuccess, handleError]);

  const handleFormSuccess = useCallback(() => {
    setShowForm(false);
    setEditingPartner(null);
    refetch();
  }, [refetch]);

  const handleFormCancel = useCallback(() => {
    setShowForm(false);
    setEditingPartner(null);
  }, []);

  const handleDragEnd = useCallback(async (result: any) => {
    if (!result.destination) return;

    const items = Array.from(partners);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    try {
      // Update display order for all affected items
      await Promise.all(
        items.map((item, index) =>
          updatePartnerOrderBase(item.id, index)
        )
      );
      refetch();
    } catch (error) {
      handleError(error, {
        title: 'Erreur de réorganisation',
        logContext: 'Partner reordering'
      });
    }
  }, [partners, updatePartnerOrderBase, refetch, handleError]);

  return {
    partners,
    loading,
    error,
    showForm,
    editingPartner,
    handleAdd,
    handleEdit,
    handleDelete,
    handleFormSuccess,
    handleFormCancel,
    handleDragEnd
  };
};
