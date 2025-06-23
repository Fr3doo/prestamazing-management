
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

interface ContentSection {
  id: string;
  section_key: string;
  title: string | null;
  content: string | null;
  image_url: string | null;
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
    title: '',
    content: '',
    image_url: '',
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (section) {
      setFormData({
        section_key: section.section_key,
        title: section.title || '',
        content: section.content || '',
        image_url: section.image_url || '',
      });
    }
  }, [section]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.section_key.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir la clé de section",
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
            title: formData.title.trim() || null,
            content: formData.content.trim() || null,
            image_url: formData.image_url.trim() || null,
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
            title: formData.title.trim() || null,
            content: formData.content.trim() || null,
            image_url: formData.image_url.trim() || null,
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

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
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
        <Label htmlFor="title">Titre</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Titre de la section"
        />
      </div>

      <div>
        <Label htmlFor="content">Contenu</Label>
        <Textarea
          id="content"
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          placeholder="Contenu de la section"
          rows={6}
        />
      </div>

      <div>
        <Label htmlFor="image_url">URL de l'image</Label>
        <Input
          id="image_url"
          value={formData.image_url}
          onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
          placeholder="https://example.com/image.jpg"
          type="url"
        />
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
