import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PartnerService } from '@/services/PartnerService';
import { supabase } from '@/integrations/supabase/client';
import { IPartnerRepository } from '@/interfaces/repositories/IPartnerRepository';

vi.mock('@/integrations/supabase/client');

describe('PartnerService', () => {
  const mockSupabase = vi.mocked(supabase);
  let repository: IPartnerRepository;
  let service: PartnerService;

  beforeEach(() => {
    repository = {
      getAllPartners: vi.fn(),
      getPartnerById: vi.fn(),
      createPartner: vi.fn(),
      updatePartner: vi.fn(),
      deletePartner: vi.fn(),
      updatePartnerOrder: vi.fn(),
      getMaxDisplayOrder: vi.fn().mockResolvedValue(1)
    } as unknown as IPartnerRepository;
    service = new PartnerService(repository);
    vi.clearAllMocks();
  });

  it('uploadPartnerLogo should upload file and return url', async () => {
    const storageMock = {
      upload: vi.fn().mockResolvedValue({ error: null }),
      getPublicUrl: vi.fn().mockReturnValue({ data: { publicUrl: 'url' } })
    };
    mockSupabase.storage = {
      from: vi.fn(() => storageMock as any)
    } as any;

    const file = new File(['test'], 'logo.png');
    const result = await service.uploadPartnerLogo(file);

    expect(storageMock.upload).toHaveBeenCalled();
    expect(result).toBe('url');
  });

  it('getNextDisplayOrder should increment max order', async () => {
    (repository.getMaxDisplayOrder as any).mockResolvedValue(5);
    const result = await service.getNextDisplayOrder();
    expect(result).toBe(6);
  });

  it('createPartner should delegate to repository', async () => {
    (repository.createPartner as any).mockResolvedValue({});
    await service.createPartner({ partner_name: 'test', logo_url: 'x' });
    expect(repository.createPartner).toHaveBeenCalled();
  });
});
