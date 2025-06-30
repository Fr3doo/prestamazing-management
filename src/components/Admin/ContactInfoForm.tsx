import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useStandardToast } from '@/hooks/useStandardToast';

interface ContactInfo {
  id: string;
  type: string;
  value: string;
  label: string | null;
  created_at: string;
  updated_at: string;
}

interface ContactInfoFormProps {
  contact?: ContactInfo | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const ContactInfoForm = ({ contact, onSuccess, onCancel }: ContactInfoFormProps) => {
  const [formData, setFormData] = useState({
    type: '',
    value: '',
    label: '',
  });
  const [loading, setLoading] = useState(false);
  const { showSuccess, showError } = useStandardToast();

  const contactTypes = [
    { value: 'phone', label: 'Téléphone' },
    { value: 'email', label: 'Email' },
    { value: 'address', label: 'Adresse' },
    { value: 'hours', label: 'Horaires' },
    { value: 'social', label: 'Réseaux sociaux' },
    { value: 'zone', label: 'Zone d\'intervention' },
    { value: 'whatsapp', label: 'WhatsApp' },
    { value: 'fax', label: 'Fax' },
    { value: 'website', label: 'Site web' },
  ];

  useEffect(() => {
    if (contact) {
      setFormData({
        type: contact.type,
        value: contact.value,
        label: contact.label || '',
      });
    }
  }, [contact]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.type.trim() || !formData.value.trim()) {
      showError("Erreur", "Veuillez remplir tous les champs obligatoires");
      return;
    }

    setLoading(true);

    try {
      if (contact) {
        // Mise à jour
        const { error } = await supabase
          .from('contact_info')
          .update({
            type: formData.type.trim(),
            value: formData.value.trim(),
            label: formData.label.trim() || null,
            updated_at: new Date().toISOString(),
          })
          .eq('id', contact.id);

        if (error) throw error;
        showSuccess("Succès", "Information de contact mise à jour");
      } else {
        // Création
        const { error } = await supabase
          .from('contact_info')
          .insert({
            type: formData.type.trim(),
            value: formData.value.trim(),
            label: formData.label.trim() || null,
          });

        if (error) throw error;
        showSuccess("Succès", "Information de contact créée");
      }

      onSuccess();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      showError("Erreur", "Impossible de sauvegarder l'information de contact");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      <div>
        <Label htmlFor="type">Type de contact *</Label>
        <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Sélectionnez un type" />
          </SelectTrigger>
          <SelectContent>
            {contactTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="label">Libellé</Label>
        <Input
          id="label"
          value={formData.label}
          onChange={(e) => setFormData({ ...formData, label: e.target.value })}
          placeholder="ex: Téléphone principal, Email support..."
        />
        <p className="text-xs text-gray-500 mt-1">
          Nom d'affichage pour cette information de contact
        </p>
      </div>

      <div>
        <Label htmlFor="value">Valeur *</Label>
        {formData.type === 'hours' || formData.type === 'address' || formData.type === 'zone' ? (
          <Textarea
            id="value"
            value={formData.value}
            onChange={(e) => setFormData({ ...formData, value: e.target.value })}
            placeholder={
              formData.type === 'hours' 
                ? "Lundi - Vendredi: 9h00 - 19h00\nSamedi: Sur rendez-vous"
                : formData.type === 'address'
                ? "123 Rue de la Restauration\n75001 Paris, France"
                : "Paris et région parisienne\nDéplacements possibles dans toute la France"
            }
            rows={4}
            required
          />
        ) : (
          <Input
            id="value"
            value={formData.value}
            onChange={(e) => setFormData({ ...formData, value: e.target.value })}
            placeholder={
              formData.type === 'phone' || formData.type === 'whatsapp'
                ? "+33 6 00 00 00 00"
                : formData.type === 'email'
                ? "contact@example.com"
                : formData.type === 'website'
                ? "https://www.example.com"
                : "Valeur de l'information de contact"
            }
            type={formData.type === 'email' ? 'email' : formData.type === 'website' ? 'url' : 'text'}
            required
          />
        )}
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Sauvegarde...' : (contact ? 'Mettre à jour' : 'Créer')}
        </Button>
      </div>
    </form>
  );
};

export default ContactInfoForm;
