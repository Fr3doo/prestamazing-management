
import React, { createContext, useContext, ReactNode } from 'react';
import { IContactRepository } from '@/interfaces/repositories/IContactRepository';
import { IReviewRepository } from '@/interfaces/repositories/IReviewRepository';
import { IContentRepository } from '@/interfaces/repositories/IContentRepository';
import { IPartnerRepository } from '@/interfaces/repositories/IPartnerRepository';
import { SupabaseContactRepository } from '@/repositories/SupabaseContactRepository';
import { SupabaseReviewRepository } from '@/repositories/SupabaseReviewRepository';
import { SupabaseContentRepository } from '@/repositories/SupabaseContentRepository';
import { SupabasePartnerRepository } from '@/repositories/SupabasePartnerRepository';

interface RepositoryContextType {
  contactRepository: IContactRepository;
  reviewRepository: IReviewRepository;
  contentRepository: IContentRepository;
  partnerRepository: IPartnerRepository;
}

const RepositoryContext = createContext<RepositoryContextType | undefined>(undefined);

interface RepositoryProviderProps {
  children: ReactNode;
  // Permet l'injection de repositories alternatifs pour les tests
  contactRepository?: IContactRepository;
  reviewRepository?: IReviewRepository;
  contentRepository?: IContentRepository;
  partnerRepository?: IPartnerRepository;
}

export const RepositoryProvider: React.FC<RepositoryProviderProps> = ({ 
  children,
  contactRepository,
  reviewRepository,
  contentRepository,
  partnerRepository
}) => {
  const repositories: RepositoryContextType = {
    contactRepository: contactRepository || new SupabaseContactRepository(),
    reviewRepository: reviewRepository || new SupabaseReviewRepository(),
    contentRepository: contentRepository || new SupabaseContentRepository(),
    partnerRepository: partnerRepository || new SupabasePartnerRepository(),
  };

  return (
    <RepositoryContext.Provider value={repositories}>
      {children}
    </RepositoryContext.Provider>
  );
};

export const useRepositories = (): RepositoryContextType => {
  const context = useContext(RepositoryContext);
  if (context === undefined) {
    throw new Error('useRepositories must be used within a RepositoryProvider');
  }
  return context;
};
