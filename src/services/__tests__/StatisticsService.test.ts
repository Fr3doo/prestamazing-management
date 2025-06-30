import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SupabaseStatisticsService } from '@/services/StatisticsService';
import { supabase } from '@/integrations/supabase/client';

vi.mock('@/integrations/supabase/client');

describe('SupabaseStatisticsService', () => {
  const mockSupabase = vi.mocked(supabase);
  let service: SupabaseStatisticsService;

  beforeEach(() => {
    service = new SupabaseStatisticsService();
    vi.clearAllMocks();
  });

  it('should fetch admin stats', async () => {
    mockSupabase.from.mockImplementation(() => ({
      select: vi.fn().mockResolvedValue({ count: 1, error: null })
    }) as any);

    const result = await service.getAdminStats();

    expect(result).toEqual({ reviews: 1, partners: 1, contacts: 1, content: 1 });
    expect(mockSupabase.from).toHaveBeenCalledTimes(4);
  });

  it('should throw error when query fails', async () => {
    mockSupabase.from.mockImplementationOnce(() => ({
      select: vi.fn().mockResolvedValue({ count: null, error: new Error('fail') })
    }) as any);

    await expect(service.getAdminStats()).rejects.toThrow('fail');
  });
});
