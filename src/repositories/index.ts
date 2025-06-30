// Interfaces
export type { IContactRepository } from '@/interfaces/repositories/IContactRepository';
export type { IReviewRepository } from '@/interfaces/repositories/IReviewRepository';
export type { IContentRepository } from '@/interfaces/repositories/IContentRepository';
export type { IPartnerRepository } from '@/interfaces/repositories/IPartnerRepository';
export type { ISecurityEventRepository } from '@/interfaces/repositories/ISecurityEventRepository';

// Implementations
export { SupabaseContactRepository } from './SupabaseContactRepository';
export { SupabaseReviewRepository } from './SupabaseReviewRepository';
export { SupabaseContentRepository } from './SupabaseContentRepository';
export { SupabasePartnerRepository } from './SupabasePartnerRepository';
export { SupabaseSecurityEventRepository } from './SupabaseSecurityEventRepository';

// Types
export type {
  ContactInfo,
  ContactSubmission,
  CreateContactInfoData,
  CreateContactSubmissionData,
} from '@/interfaces/repositories/IContactRepository';

export type {
  Review,
  CreateReviewData,
  UpdateReviewData,
} from '@/interfaces/repositories/IReviewRepository';

export type {
  ContentSection,
  CreateContentSectionData,
  UpdateContentSectionData,
} from '@/interfaces/repositories/IContentRepository';

export type {
  Partner,
  CreatePartnerData,
  UpdatePartnerData,
} from '@/interfaces/repositories/IPartnerRepository';
