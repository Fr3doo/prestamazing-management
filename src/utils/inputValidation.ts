
import DOMPurify from 'dompurify';
import { 
  contactFormSchema, 
  contentSectionSchema, 
  reviewValidationSchema 
} from './validationRules';

// Re-export des schémas pour compatibilité
export { 
  contactFormSchema, 
  contentSectionSchema, 
  reviewValidationSchema 
};

// Utilitaires de sanitisation utilisés
export const sanitizeHtml = (input: string): string => {
  return DOMPurify.sanitize(input, { ALLOWED_TAGS: [] });
};

export const sanitizeText = (input: string): string => {
  return input.trim().replace(/[<>]/g, '');
};

export const sanitizeEmail = (email: string): string => {
  return email.toLowerCase().trim();
};

// Rate limiting simplifié
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
}

export const contactFormRateLimit = new RateLimiter(3, 10 * 60 * 1000);
