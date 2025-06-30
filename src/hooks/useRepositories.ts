
import { useServices } from '@/providers/ServiceProvider';
import { IContactRepository } from '@/interfaces/repositories/IContactRepository';
import { IReviewRepository } from '@/interfaces/repositories/IReviewRepository';
import { IContentRepository } from '@/interfaces/repositories/IContentRepository';
import { IPartnerRepository } from '@/interfaces/repositories/IPartnerRepository';

interface UseRepositoriesReturn {
  contactRepository: IContactRepository;
  reviewRepository: IReviewRepository;
  contentRepository: IContentRepository;
  partnerRepository: IPartnerRepository;
}

export const useRepositories = (): UseRepositoriesReturn => {
  const services = useServices();
  
  return {
    contactRepository: services.contactRepository,
    reviewRepository: services.reviewRepository,
    contentRepository: services.contentRepository,
    partnerRepository: services.partnerRepository,
  };
};
