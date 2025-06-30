
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SupabaseContactRepository } from '@/repositories/SupabaseContactRepository';
import { supabase } from '@/integrations/supabase/client';

vi.mock('@/integrations/supabase/client');

describe('SupabaseContactRepository', () => {
  let repository: SupabaseContactRepository;
  const mockSupabase = vi.mocked(supabase);

  beforeEach(() => {
    repository = new SupabaseContactRepository();
    vi.clearAllMocks();
  });

  describe('getAllContactInfo', () => {
    it('should fetch all contact info successfully', async () => {
      const mockData = [
        { id: '1', type: 'email', value: 'test@example.com', label: 'Contact', created_at: '2023-01-01', updated_at: '2023-01-01' }
      ];

      mockSupabase.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          order: vi.fn().mockResolvedValue({
            data: mockData,
            error: null
          })
        })
      } as any);

      const result = await repository.getAllContactInfo();

      expect(result).toEqual(mockData);
      expect(mockSupabase.from).toHaveBeenCalledWith('contact_info');
    });

    it('should throw error when database call fails', async () => {
      const mockError = new Error('Database error');

      mockSupabase.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          order: vi.fn().mockResolvedValue({
            data: null,
            error: mockError
          })
        })
      } as any);

      await expect(repository.getAllContactInfo()).rejects.toThrow('Database error');
    });
  });

  describe('createContactInfo', () => {
    it('should create contact info successfully', async () => {
      const mockContactData = {
        type: 'email',
        value: 'test@example.com',
        label: 'Contact'
      };

      const mockResult = {
        id: '1',
        ...mockContactData,
        created_at: '2023-01-01',
        updated_at: '2023-01-01'
      };

      mockSupabase.from.mockReturnValue({
        insert: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: mockResult,
              error: null
            })
          })
        })
      } as any);

      const result = await repository.createContactInfo(mockContactData);

      expect(result).toEqual(mockResult);
    });
  });
});
