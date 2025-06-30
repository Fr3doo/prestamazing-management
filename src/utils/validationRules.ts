import { z } from 'zod';

// Règles de validation centralisées et utilisées
export const ValidationRules = {
  name: z.string()
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(100, 'Le nom ne peut pas dépasser 100 caractères')
    .regex(/^[a-zA-ZÀ-ÿ\s-']+$/, 'Le nom contient des caractères invalides'),
  
  email: z.string()
    .email('Veuillez entrer une adresse email valide')
    .max(254, 'L\'adresse email est trop longue'),
    
  phone: z.string()
    .optional()
    .refine((phone) => !phone || /^(\+33|0)[1-9](?:[0-9]{8})$/.test(phone.replace(/\s/g, '')), 
      'Numéro de téléphone invalide'),
      
  url: z.string()
    .url('URL invalide')
    .max(500, 'L\'URL est trop longue')
    .optional()
    .or(z.literal('')),
    
  text: z.string()
    .min(1, 'Ce champ est requis')
    .max(200, 'Le texte ne peut pas dépasser 200 caractères'),
    
  longText: z.string()
    .min(10, 'Le texte doit contenir au moins 10 caractères')
    .max(2000, 'Le texte ne peut pas dépasser 2000 caractères'),
    
  rating: z.number()
    .int('La note doit être un nombre entier')
    .min(1, 'La note minimum est 1')
    .max(5, 'La note maximum est 5'),
    
  sectionKey: z.string()
    .min(1, 'La clé de section est requise')
    .max(50, 'La clé de section ne peut pas dépasser 50 caractères')
    .regex(/^[a-z0-9_]+$/, 'La clé de section ne peut contenir que des lettres minuscules, chiffres et underscores'),
};

// Schémas utilisés dans l'application
export const contactFormSchema = z.object({
  name: ValidationRules.name,
  email: ValidationRules.email,
  phone: ValidationRules.phone,
  subject: z.string()
    .min(5, 'Le sujet doit contenir au moins 5 caractères')
    .max(200, 'Le sujet ne peut pas dépasser 200 caractères'),
  message: ValidationRules.longText
});

export const contentSectionSchema = z.object({
  section_key: ValidationRules.sectionKey,
  title: ValidationRules.text.optional(),
  content: z.string()
    .max(5000, 'Le contenu ne peut pas dépasser 5000 caractères')
    .optional(),
  image_url: ValidationRules.url
});

export const reviewValidationSchema = z.object({
  name: ValidationRules.name,
  rating: ValidationRules.rating,
  comment: ValidationRules.longText,
});

// Nouveau schéma pour ContactInfo
export const contactInfoValidationSchema = z.object({
  type: z.string().min(1, "Le type est obligatoire"),
  value: z.string().min(1, "La valeur est obligatoire"),
  label: z.string().optional(),
});
