
// Domain-specific hooks for data management
export { useReviews } from '../useReviews';
export { usePartners } from '../usePartners';
export { useContent } from '../useContent';
export { useContacts } from '../useContacts';

// Management hooks that combine domain hooks with UI state
export { useReviewsManagement } from '../useReviewsManagement';
export { usePartnersManagement } from '../usePartnersManagement';
export { useContentManagement } from '../useContentManagement';
export { useContactManagement } from '../useContactManagement';

// Types re-exports for convenience
export type { Review } from '../useReviewsManagement';
