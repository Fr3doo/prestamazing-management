
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, ExternalLink, GripVertical } from 'lucide-react';
import PartnerForm from './PartnerForm';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

interface Partner {
  id: string;
  partner_name: string;
  logo_url: string;
  website_url: string | null;
  display_order: number;
  created_at: string;
  updated_at: string;
}

const PartnersManagement = () => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchPartners();
  }, []);

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

    // Mettre à jour l'ordre d'affichage
    const updatedPartners = reorderedPartners.map((partner, index) => ({
      ...partner,
      display_order: index,
    }));

    setPartners(updatedPartners);

    // Sauvegarder en base
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
      fetchPartners(); // Recharger en cas d'erreur
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center">Chargement...</div>
      </div>
    );
  }

  if (showForm) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            {editingPartner ? 'Modifier le partenaire' : 'Ajouter un partenaire'}
          </h1>
        </div>
        <PartnerForm
          partner={editingPartner}
          onSuccess={handleFormSuccess}
          onCancel={handleFormCancel}
        />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des partenaires</h1>
          <p className="text-gray-600">Gérez les logos et informations de vos partenaires</p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="h-4 w-4 mr-2" />
          Ajouter un partenaire
        </Button>
      </div>

      {partners.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-500">Aucun partenaire ajouté pour le moment.</p>
            <Button onClick={handleAdd} className="mt-4">
              <Plus className="h-4 w-4 mr-2" />
              Ajouter le premier partenaire
            </Button>
          </CardContent>
        </Card>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="partners">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="grid gap-4"
              >
                {partners.map((partner, index) => (
                  <Draggable key={partner.id} draggableId={partner.id} index={index}>
                    {(provided, snapshot) => (
                      <Card
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`transition-shadow ${
                          snapshot.isDragging ? 'shadow-lg' : ''
                        }`}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center gap-4">
                            <div
                              {...provided.dragHandleProps}
                              className="text-gray-400 hover:text-gray-600 cursor-grab"
                            >
                              <GripVertical className="h-5 w-5" />
                            </div>
                            
                            <div className="flex-shrink-0">
                              <img
                                src={partner.logo_url}
                                alt={partner.partner_name}
                                className="h-12 w-12 object-contain bg-gray-100 rounded border"
                              />
                            </div>
                            
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900">
                                {partner.partner_name}
                              </h3>
                              {partner.website_url && (
                                <a
                                  href={partner.website_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                                >
                                  <ExternalLink className="h-3 w-3" />
                                  Visiter le site
                                </a>
                              )}
                            </div>
                            
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEdit(partner)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDelete(partner.id)}
                                className="text-red-600 hover:text-red-800"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}
    </div>
  );
};

export default PartnersManagement;
