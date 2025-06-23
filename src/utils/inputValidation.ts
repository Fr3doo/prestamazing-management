
import DOMPurify from 'dompurify';
import { z } from 'zod';

// Input sanitization utilities
export const sanitizeHtml = (input: string): string => {
  return DOMPurify.sanitize(input, { ALLOWED_TAGS: [] });
};

export const sanitizeText = (input: string): string => {
  return input.trim().replace(/[<>]/g, '');
};

export const sanitizeEmail = (email: string): string => {
  return email.toLowerCase().trim();
};

// Validation schemas
export const contactFormSchema = z.object({
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
  subject: z.string()
    .min(5, 'Le sujet doit contenir au moins 5 caractères')
    .max(200, 'Le sujet ne peut pas dépasser 200 caractères'),
  message: z.string()
    .min(10, 'Le message doit contenir au moins 10 caractères')
    .max(2000, 'Le message ne peut pas dépasser 2000 caractères')
});

export const contentSectionSchema = z.object({
  section_key: z.string()
    .min(1, 'La clé de section est requise')
    .max(50, 'La clé de section ne peut pas dépasser 50 caractères')
    .regex(/^[a-z0-9_]+$/, 'La clé de section ne peut contenir que des lettres minuscules, chiffres et underscores'),
  title: z.string()
    .max(200, 'Le titre ne peut pas dépasser 200 caractères')
    .optional(),
  content: z.string()
    .max(5000, 'Le contenu ne peut pas dépasser 5000 caractères')
    .optional(),
  image_url: z.string()
    .url('URL d\'image invalide')
    .max(500, 'L\'URL de l\'image est trop longue')
    .optional()
    .or(z.literal(''))
});

export const reviewSchema = z.object({
  name: z.string()
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(100, 'Le nom ne peut pas dépasser 100 caractères'),
  rating: z.number()
    .int('La note doit être un nombre entier')
    .min(1, 'La note minimum est 1')
    .max(5, 'La note maximum est 5'),
  comment: z.string()
    .min(10, 'Le commentaire doit contenir au moins 10 caractères')
    .max(1000, 'Le commentaire ne peut pas dépasser 1000 caractères'),
  position: z.string()
    .max(100, 'Le poste ne peut pas dépasser 100 caractères')
    .optional(),
  company: z.string()
    .max(100, 'Le nom de l\'entreprise ne peut pas dépasser 100 caractères')
    .optional()
});

// Rate limiting utility
export class RateLimiter {
  private attempts: Map<string, { count: number; resetTime: number }> = new Map();
  
  constructor(private maxAttempts: number = 5, private windowMs: number = 15 * 60 * 1000) {}
  
  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const record = this.attempts.get(identifier);
    
    if (!record || now > record.resetTime) {
      this.attempts.set(identifier, { count: 1, resetTime: now + this.windowMs });
      return true;
    }
    
    if (record.count >= this.maxAttempts) {
      return false;
    }
    
    record.count++;
    return true;
  }
  
  getRemainingTime(identifier: string): number {
    const record = this.attempts.get(identifier);
    if (!record) return 0;
    
    const now = Date.now();
    return Math.max(0, record.resetTime - now);
  }
}

export const contactFormRateLimit = new RateLimiter(3, 10 * 60 * 1000); // 3 attempts per 10 minutes
