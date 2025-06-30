
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Partner {
  id: string;
  partner_name: string;
  logo_url: string;
  website_url: string | null;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export const usePartnersManagement = () => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
  const { toast } = useToast();

  const fetchPartners = async () => {
    try {
      const { data, error } = await supabase
        .from('partners_logos')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setPartners(data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des partenaires:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les partenaires",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce partenaire ?')) return;

    try {
      const { error } = await supabase
        .from('partners_logos')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Partenaire supprimé avec succès",
      });

      fetchPartners();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le partenaire",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (partner: Partner) => {
    setEditingPartner(partner);
    setShowForm(true);
  };

  const handleAdd = () => {
    setEditingPartner(null);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingPartner(null);
    fetchPartners();
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingPartner(null);
  };

  const handleDragEnd = async (result: any) => {
    if (!result.destination) return;

    const reorderedPartners = Array.from(partners);
    const [movedPartner] = reorderedPartners.splice(result.source.index, 1);
    reorderedPartners.splice(result.destination.index, 0, movedPartner);

    const updatedPartners = reorderedPartners.map((partner, index) => ({
      ...partner,
      display_order: index,
    }));

    setPartners(updatedPartners);

    try {
      const updates = updatedPartners.map((partner) => ({
        id: partner.id,
        display_order: partner.display_order,
      }));

      for (const update of updates) {
        await supabase
          .from('partners_logos')
          .update({ display_order: update.display_order })
          .eq('id', update.id);
      }

      toast({
        title: "Succès",
        description: "Ordre des partenaires mis à jour",
      });
    } catch (error) {
      console.error('Erreur lors de la réorganisation:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder l'ordre",
        variant: "destructive",
      });
      fetchPartners();
    }
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  return {
    partners,
    loading,
    showForm,
    editingPartner,
    handleAdd,
    handleEdit,
    handleDelete,
    handleFormSuccess,
    handleFormCancel,
    handleDragEnd,
  };
};
