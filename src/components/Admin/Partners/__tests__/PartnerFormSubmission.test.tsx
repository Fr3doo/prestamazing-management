
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { usePartnerFormSubmission } from '../PartnerFormSubmission';

// Mock the hooks and services
vi.mock('@/providers/ServiceProvider', () => ({
  useServices: () => ({
    partnerService: {
      uploadPartnerLogo: vi.fn(),
      getNextDisplayOrder: vi.fn(),
    },
  }),
}));

vi.mock('@/hooks/useRepositories', () => ({
  useRepositories: () => ({
    partnerRepository: {
      updatePartner: vi.fn(),
      createPartner: vi.fn(),
    },
  }),
}));

describe('usePartnerFormSubmission', () => {
  const mockShowSuccess = vi.fn();
  const mockShowError = vi.fn();
  const mockOnSuccess = vi.fn();
  
  const defaultProps = {
    partner: null,
    partnerName: 'Test Partner',
    websiteUrl: 'https://example.com',
    logoFile: null,
    onSuccess: mockOnSuccess,
    showSuccess: mockShowSuccess,
    showError: mockShowError,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should provide submitForm function', () => {
    const { result } = renderHook(() => usePartnerFormSubmission(defaultProps));
    
    expect(result.current).toHaveProperty('submitForm');
    expect(typeof result.current.submitForm).toBe('function');
  });

  it('should handle create partner scenario', async () => {
    const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    const { useServices } = await import('@/providers/ServiceProvider');
    const { useRepositories } = await import('@/hooks/useRepositories');
    
    const mockServices = useServices() as any;
    const mockRepositories = useRepositories() as any;
    
    mockServices.partnerService.uploadPartnerLogo.mockResolvedValue('logo-url');
    mockServices.partnerService.getNextDisplayOrder.mockResolvedValue(5);
    mockRepositories.partnerRepository.createPartner.mockResolvedValue({});

    const { result } = renderHook(() => 
      usePartnerFormSubmission({
        ...defaultProps,
        logoFile: mockFile,
      })
    );

    await result.current.submitForm();

    expect(mockServices.partnerService.uploadPartnerLogo).toHaveBeenCalledWith(mockFile);
    expect(mockServices.partnerService.getNextDisplayOrder).toHaveBeenCalled();
    expect(mockRepositories.partnerRepository.createPartner).toHaveBeenCalledWith({
      partner_name: 'Test Partner',
      website_url: 'https://example.com',
      logo_url: 'logo-url',
      display_order: 5,
    });
    expect(mockShowSuccess).toHaveBeenCalledWith('Succès', 'Partenaire ajouté avec succès');
    expect(mockOnSuccess).toHaveBeenCalled();
  });

  it('should handle update partner scenario', async () => {
    const mockPartner = {
      id: '1',
      partner_name: 'Old Partner',
      logo_url: 'old-logo-url',
      website_url: 'https://old.com',
      display_order: 1,
      created_at: '2023-01-01',
      updated_at: '2023-01-01',
    };

    const { useRepositories } = await import('@/hooks/useRepositories');
    const mockRepositories = useRepositories() as any;
    
    mockRepositories.partnerRepository.updatePartner.mockResolvedValue({});

    const { result } = renderHook(() => 
      usePartnerFormSubmission({
        ...defaultProps,
        partner: mockPartner,
      })
    );

    await result.current.submitForm();

    expect(mockRepositories.partnerRepository.updatePartner).toHaveBeenCalledWith(
      '1',
      expect.objectContaining({
        partner_name: 'Test Partner',
        website_url: 'https://example.com',
        logo_url: 'old-logo-url',
        updated_at: expect.any(String),
      })
    );
    expect(mockShowSuccess).toHaveBeenCalledWith('Succès', 'Partenaire mis à jour avec succès');
    expect(mockOnSuccess).toHaveBeenCalled();
  });

  it('should handle errors during submission', async () => {
    const { useRepositories } = await import('@/hooks/useRepositories');
    const mockRepositories = useRepositories() as any;
    
    mockRepositories.partnerRepository.createPartner.mockRejectedValue(new Error('Test error'));

    const { result } = renderHook(() => usePartnerFormSubmission(defaultProps));

    await expect(result.current.submitForm()).rejects.toThrow('Test error');
    expect(mockShowError).toHaveBeenCalledWith('Erreur', 'Impossible de sauvegarder le partenaire');
  });

  it('should handle empty website URL', async () => {
    const { useServices } = await import('@/providers/ServiceProvider');
    const { useRepositories } = await import('@/hooks/useRepositories');
    
    const mockServices = useServices() as any;
    const mockRepositories = useRepositories() as any;
    
    mockServices.partnerService.getNextDisplayOrder.mockResolvedValue(1);
    mockRepositories.partnerRepository.createPartner.mockResolvedValue({});

    const { result } = renderHook(() => 
      usePartnerFormSubmission({
        ...defaultProps,
        websiteUrl: '',
      })
    );

    await result.current.submitForm();

    expect(mockRepositories.partnerRepository.createPartner).toHaveBeenCalledWith(
      expect.objectContaining({
        website_url: null,
      })
    );
  });
});
