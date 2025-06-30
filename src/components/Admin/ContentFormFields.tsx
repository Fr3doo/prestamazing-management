
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface ContentFormFieldsProps {
  formData: {
    section_key: string;
    title: string;
    content: string;
    image_url: string;
  };
  errors: Record<string, string>;
  onInputChange: (field: string, value: string) => void;
  isEditing: boolean;
}

const ContentFormFields = ({ formData, errors, onInputChange, isEditing }: ContentFormFieldsProps) => {
  return (
    <>
      <div>
        <Label htmlFor="section_key">Clé de section *</Label>
        <Input
          id="section_key"
          value={formData.section_key}
          onChange={(e) => onInputChange('section_key', e.target.value)}
          required
          placeholder="ex: hero_title"
          disabled={isEditing}
          maxLength={50}
          className={errors.section_key ? 'border-red-500' : ''}
          aria-describedby={errors.section_key ? 'section_key-error' : undefined}
        />
        {errors.section_key && (
          <p id="section_key-error" className="text-red-500 text-sm mt-1" role="alert">
            {errors.section_key}
          </p>
        )}
        <p className="text-xs text-gray-500 mt-1">
          Identifiant unique technique (ne pas modifier pour les sections existantes)
        </p>
      </div>

      <div>
        <Label htmlFor="title">Titre</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => onInputChange('title', e.target.value)}
          placeholder="Titre de la section"
          maxLength={200}
          className={errors.title ? 'border-red-500' : ''}
          aria-describedby={errors.title ? 'title-error' : undefined}
        />
        {errors.title && (
          <p id="title-error" className="text-red-500 text-sm mt-1" role="alert">
            {errors.title}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="content">Contenu</Label>
        <Textarea
          id="content"
          value={formData.content}
          onChange={(e) => onInputChange('content', e.target.value)}
          placeholder="Contenu de la section"
          rows={6}
          maxLength={5000}
          className={errors.content ? 'border-red-500' : ''}
          aria-describedby={errors.content ? 'content-error' : undefined}
        />
        {errors.content && (
          <p id="content-error" className="text-red-500 text-sm mt-1" role="alert">
            {errors.content}
          </p>
        )}
        <p className="text-sm text-gray-500 mt-1">
          {formData.content.length}/5000 caractères
        </p>
      </div>

      <div>
        <Label htmlFor="image_url">URL de l'image</Label>
        <Input
          id="image_url"
          value={formData.image_url}
          onChange={(e) => onInputChange('image_url', e.target.value)}
          placeholder="https://example.com/image.jpg"
          type="url"
          maxLength={500}
          className={errors.image_url ? 'border-red-500' : ''}
          aria-describedby={errors.image_url ? 'image_url-error' : undefined}
        />
        {errors.image_url && (
          <p id="image_url-error" className="text-red-500 text-sm mt-1" role="alert">
            {errors.image_url}
          </p>
        )}
      </div>
    </>
  );
};

export default ContentFormFields;
