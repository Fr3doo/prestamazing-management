
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';

interface ContentSection {
  id: string;
  section_key: string;
  section_name: string;
  content_type: string;
  content_value: string | null;
  page_name: string;
  description: string | null;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

interface ContentFormProps {
  section?: ContentSection | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const ContentForm = ({ section, onSuccess, onCancel }: ContentFormProps) => {
  const [formData, setFormData] = useState({
    section_key: '',
    section_name: '',
    content_type: 'text',
    content_value: '',
    page_name: '',
    description: '',
    is_active: true,
    display_order: 0,
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const pages = [
    { value: 'accueil', label: 'Accueil' },
    { value: 'a-propos', label: 'À propos' },
    { value: 'services', label: 'Services' },
    { value: 'contact', label: 'Contact' },
  ];

  const contentTypes = [
    { value: 'text', label: 'Texte court' },
    { value: 'textarea', label: 'Texte long' },
    { value: 'rich_text', label: 'Texte enrichi' },
    { value: 'image', label: 'Image (URL)' },
    { value: 'url', label: 'Lien URL' },
  ];

  useEffect(() => {
    if (section) {
      setFormData({
        section_key: section.section_key,
        section_name: section.section_name,
        content_type: section.content_type,
        content_value: section.content_value || '',
        page_name: section.page_name,
        description: section.description || '',
        is_active: section.is_active,
        display_order: section.display_order,
      });
    }
  }, [section]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.section_key.trim() || !formData.section_name.trim() || !formData.page_name) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      if (section) {
        // Mise à jour
        const { error } = await supabase
          .from('content_sections')
          .update({
            section_key: formData.section_key.trim(),
            section_name: formData.section_name.trim(),
            content_type: formData.content_type,
            content_value: formData.content_value.trim() || null,
            page_name: formData.page_name,
            description: formData.description.trim() || null,
            is_active: formData.is_active,
            display_order: formData.display_order,
            updated_at: new Date().toISOString(),
          })
          .eq('id', section.id);

        if (error) throw error;

        toast({
          title: "Succès",
          description: "Section mise à jour avec succès",
        });
      } else {
        // Création
        const { error } = await supabase
          .from('content_sections')
          .insert({
            section_key: formData.section_key.trim(),
            section_name: formData.section_name.trim(),
            content_type: formData.content_type,
            content_value: formData.content_value.trim() || null,
            page_name: formData.page_name,
            description: formData.description.trim() || null,
            is_active: formData.is_active,
            display_order: formData.display_order,
          });

        if (error) throw error;

        toast({
          title: "Succès",
          description: "Section créée avec succès",
        });
      }

      onSuccess();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder la section",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const renderContentInput = () => {
    switch (formData.content_type) {
      case 'textarea':
      case 'rich_text':
        return (
          <Textarea
            value={formData.content_value}
            onChange={(e) => setFormData({ ...formData, content_value: e.target.value })}
            placeholder="Contenu de la section"
            rows={6}
          />
        );
      default:
        return (
          <Input
            value={formData.content_value}
            onChange={(e) => setFormData({ ...formData, content_value: e.target.value })}
            placeholder="Contenu de la section"
          />
        );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="section_key">Clé de section *</Label>
          <Input
            id="section_key"
            value={formData.section_key}
            onChange={(e) => setFormData({ ...formData, section_key: e.target.value })}
            required
            placeholder="ex: hero_title"
            disabled={!!section} // Désactiver la modification de la clé pour les sections existantes
          />
          <p className="text-xs text-gray-500 mt-1">
            Identifiant unique technique (ne pas modifier pour les sections existantes)
          </p>
        </div>

        <div>
          <Label htmlFor="section_name">Nom de la section *</Label>
          <Input
            id="section_name"
            value={formData.section_name}
            onChange={(e) => setFormData({ ...formData, section_name: e.target.value })}
            required
            placeholder="ex: Titre principal Hero"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="page_name">Page *</Label>
          <Select value={formData.page_name} onValueChange={(value) => setFormData({ ...formData, page_name: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner une page" />
            </SelectTrigger>
            <SelectContent>
              {pages.map(page => (
                <SelectItem key={page.value} value={page.value}>
                  {page.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="content_type">Type de contenu</Label>
          <Select value={formData.content_type} onValueChange={(value) => setFormData({ ...formData, content_type: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {contentTypes.map(type => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="content_value">Contenu</Label>
        {renderContentInput()}
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Description pour aider à comprendre l'usage de cette section"
          rows={2}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="display_order">Ordre d'affichage</Label>
          <Input
            id="display_order"
            type="number"
            value={formData.display_order}
            onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
            min="0"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="is_active"
            checked={formData.is_active}
            onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
          />
          <Label htmlFor="is_active">Section active</Label>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Sauvegarde...' : (section ? 'Mettre à jour' : 'Créer')}
        </Button>
      </div>
    </form>
  );
};

export default ContentForm;
