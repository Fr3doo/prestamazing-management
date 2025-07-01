
import React, { useState, useEffect } from 'react';
import { useRepositories } from '@/hooks/useRepositories';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useStandardToast } from '@/hooks/useStandardToast';
import { useFormFields } from '@/hooks/useFormFields';
import { ContactSelectors } from '@/utils/selectors';

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
  const {
    getFieldValue,
    setField,
    updateFields,
    validateField,
  } = useFormFields({
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
      updateFields({
        type: contact.type,
        value: contact.value,
        label: contact.label || '',
      });
    }
  }, [contact, updateFields]);

  const { contactRepository } = useRepositories();

  // Validation encapsulée
  const isFormValid = () => {
    return validateField('type', (value) => Boolean(value.trim())) &&
           validateField('value', (value) => Boolean(value.trim()));
  };

  // Getters encapsulés pour éviter le chaînage
  const getFormType = () => getFieldValue('type');
  const getFormValue = () => getFieldValue('value');
  const getFormLabel = () => getFieldValue('label');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isFormValid()) {
      showError("Erreur", "Veuillez remplir tous les champs obligatoires");
      return;
    }

    setLoading(true);

    try {
      const formData = {
        type: getFormType().trim(),
        value: getFormValue().trim(),
        label: getFormLabel().trim() || null,
      };

      if (contact) {
        await contactRepository.updateContactInfo(contact.id, formData);
        showSuccess("Succès", "Information de contact mise à jour");
      } else {
        await contactRepository.createContactInfo({
          ...formData,
          label: formData.label || undefined,
        });
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

  // Méthodes encapsulées pour l'affichage conditionnel
  const isMultilineField = () => {
    const type = getFormType();
    return type === 'hours' || type === 'address' || type === 'zone';
  };

  const getPlaceholderText = () => {
    const type = getFormType();
    switch (type) {
      case 'phone':
      case 'whatsapp':
        return "+33 6 00 00 00 00";
      case 'email':
        return "contact@example.com";
      case 'website':
        return "https://www.example.com";
      case 'hours':
        return "Lundi - Vendredi: 9h00 - 19h00\nSamedi: Sur rendez-vous";
      case 'address':
        return "123 Rue de la Restauration\n75001 Paris, France";
      case 'zone':
        return "Paris et région parisienne\nDéplacements possibles dans toute la France";
      default:
        return "Valeur de l'information de contact";
    }
  };

  const getInputType = () => {
    const type = getFormType();
    if (type === 'email') return 'email';
    if (type === 'website') return 'url';
    return 'text';
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      <div>
        <Label htmlFor="type">Type de contact *</Label>
        <Select value={getFormType()} onValueChange={(value) => setField('type', value)}>
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
          value={getFormLabel()}
          onChange={(e) => setField('label', e.target.value)}
          placeholder="ex: Téléphone principal, Email support..."
        />
        <p className="text-xs text-gray-500 mt-1">
          Nom d'affichage pour cette information de contact
        </p>
      </div>

      <div>
        <Label htmlFor="value">Valeur *</Label>
        {isMultilineField() ? (
          <Textarea
            id="value"
            value={getFormValue()}
            onChange={(e) => setField('value', e.target.value)}
            placeholder={getPlaceholderText()}
            rows={4}
            required
          />
        ) : (
          <Input
            id="value"
            value={getFormValue()}
            onChange={(e) => setField('value', e.target.value)}
            placeholder={getPlaceholderText()}
            type={getInputType()}
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
