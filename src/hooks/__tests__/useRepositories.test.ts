
import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useRepositories } from '@/hooks/useRepositories';

// Mock the ServiceProvider
vi.mock('@/providers/ServiceProvider', () => ({
  useServices: () => ({
    contactRepository: {
      getAllContactInfo: vi.fn(),
      createContactInfo: vi.fn(),
      updateContactInfo: vi.fn(),
      deleteContactInfo: vi.fn(),
    },
    reviewRepository: {
      getAllReviews: vi.fn(),
      createReview: vi.fn(),
      updateReview: vi.fn(),
      deleteReview: vi.fn(),
    },
    contentRepository: {
      getAllContentSections: vi.fn(),
      createContentSection: vi.fn(),
      updateContentSection: vi.fn(),
      deleteContentSection: vi.fn(),
    },
    partnerRepository: {
      getAllPartners: vi.fn(),
      createPartner: vi.fn(),
      updatePartner: vi.fn(),
      deletePartner: vi.fn(),
    },
  }),
}));

describe('useRepositories', () => {
  it('should return all repositories', () => {
    const { result } = renderHook(() => useRepositories());

    expect(result.current).toHaveProperty('contactRepository');
    expect(result.current).toHaveProperty('reviewRepository');
    expect(result.current).toHaveProperty('contentRepository');
    expect(result.current).toHaveProperty('partnerRepository');
  });

  it('should provide contactRepository with correct methods', () => {
    const { result } = renderHook(() => useRepositories());
    
    expect(result.current.contactRepository).toHaveProperty('getAllContactInfo');
    expect(result.current.contactRepository).toHaveProperty('createContactInfo');
    expect(result.current.contactRepository).toHaveProperty('updateContactInfo');
    expect(result.current.contactRepository).toHaveProperty('deleteContactInfo');
  });
});
