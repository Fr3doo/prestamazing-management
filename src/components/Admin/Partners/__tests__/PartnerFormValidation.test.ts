
import { describe, it, expect, vi } from 'vitest';
import { createPartnerFormValidation } from '../PartnerFormValidation';

describe('PartnerFormValidation', () => {
  const mockShowError = vi.fn();
  let validation: ReturnType<typeof createPartnerFormValidation>;

  beforeEach(() => {
    vi.clearAllMocks();
    validation = createPartnerFormValidation(mockShowError);
  });

  describe('validateFileUpload', () => {
    it('should return valid for correct image file', () => {
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      const result = validation.validateFileUpload(file);
      
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should return invalid for non-image file', () => {
      const file = new File(['test'], 'test.txt', { type: 'text/plain' });
      const result = validation.validateFileUpload(file);
      
      expect(result.isValid).toBe(false);
      expect(result.error).toBe("Veuillez sélectionner un fichier image");
    });

    it('should return invalid for file too large', () => {
      const largeFile = new File(['x'.repeat(3 * 1024 * 1024)], 'test.jpg', { type: 'image/jpeg' });
      const result = validation.validateFileUpload(largeFile);
      
      expect(result.isValid).toBe(false);
      expect(result.error).toBe("L'image ne doit pas dépasser 2MB");
    });
  });

  describe('isFormValid', () => {
    it('should return true for valid form data', () => {
      const result = validation.isFormValid('Test Partner', true);
      expect(result).toBe(true);
    });

    it('should return false for empty partner name', () => {
      const result = validation.isFormValid('', true);
      expect(result).toBe(false);
    });

    it('should return false for missing logo', () => {
      const result = validation.isFormValid('Test Partner', false);
      expect(result).toBe(false);
    });

    it('should return false for whitespace-only partner name', () => {
      const result = validation.isFormValid('   ', true);
      expect(result).toBe(false);
    });
  });

  describe('getValidationErrors', () => {
    it('should return empty array for valid data', () => {
      const errors = validation.getValidationErrors('Test Partner', true);
      expect(errors).toEqual([]);
    });

    it('should return error for empty partner name', () => {
      const errors = validation.getValidationErrors('', true);
      expect(errors).toContain("Le nom du partenaire est requis");
    });

    it('should return error for missing logo', () => {
      const errors = validation.getValidationErrors('Test Partner', false);
      expect(errors).toContain("Veuillez sélectionner un logo");
    });

    it('should return multiple errors', () => {
      const errors = validation.getValidationErrors('', false);
      expect(errors).toHaveLength(2);
      expect(errors).toContain("Le nom du partenaire est requis");
      expect(errors).toContain("Veuillez sélectionner un logo");
    });
  });
});
