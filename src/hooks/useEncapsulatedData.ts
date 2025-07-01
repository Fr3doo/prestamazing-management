
// Hook pour encapsuler l'accès aux données et éviter le chaînage
// Utilise les facades et selectors pour respecter la Loi de Déméter

import { useMemo } from 'react';
import { ContactFacade, ReviewFacade, PartnerFacade } from '@/utils/facades';
import { ContentSelectors } from '@/utils/selectors';
import { useContacts } from './useContacts';
import { useReviews } from './useReviews';
import { usePartners } from './usePartners';
import { useContent } from './useContent';

export const useEncapsulatedContacts = () => {
  const { contactInfo, loading, error, createContactInfo, updateContactInfo, deleteContactInfo } = useContacts();
  
  const contactFacade = useMemo(() => new ContactFacade(contactInfo), [contactInfo]);
  
  return {
    // Données encapsulées
    contacts: contactFacade.getContactsForDisplay(),
    contactTypes: contactFacade.getContactTypes(),
    stats: contactFacade.getContactStats(),
    
    // États
    loading,
    error,
    
    // Actions
    createContact: createContactInfo,
    updateContact: updateContactInfo,
    deleteContact: deleteContactInfo,
    
    // Méthodes utilitaires
    findByType: (type: string) => contactFacade.findContactsByType(type)
  };
};

export const useEncapsulatedReviews = () => {
  const { reviews, loading, error, createReview, updateReview, deleteReview } = useReviews();
  
  const reviewFacade = useMemo(() => new ReviewFacade(reviews), [reviews]);
  
  return {
    // Données encapsulées
    reviews: reviewFacade.getReviewsForDisplay(),
    stats: reviewFacade.getReviewStats(),
    topRated: reviewFacade.getTopRatedReviews(),
    recent: reviewFacade.getRecentReviews(),
    
    // États
    loading,
    error,
    
    // Actions
    createReview,
    updateReview,
    deleteReview
  };
};

export const useEncapsulatedPartners = () => {
  const { partners, loading, error, createPartner, updatePartner, deletePartner, updatePartnerOrder } = usePartners();
  
  const partnerFacade = useMemo(() => new PartnerFacade(partners), [partners]);
  
  return {
    // Données encapsulées
    partners: partnerFacade.getPartnersForDisplay(),
    stats: partnerFacade.getPartnerStats(),
    nextOrder: partnerFacade.getNextOrder(),
    
    // États
    loading,
    error,
    
    // Actions
    createPartner,
    updatePartner,
    deletePartner,
    
    // Méthodes utilitaires
    reorderPartners: (fromIndex: number, toIndex: number) => {
      const reorderData = partnerFacade.reorderPartners(fromIndex, toIndex);
      return Promise.all(
        reorderData.map(({ id, newOrder }) => updatePartnerOrder(id, newOrder))
      );
    }
  };
};

export const useEncapsulatedContent = () => {
  const { contentSections, loading, error, getContentByKey, createContentSection, updateContentSection, deleteContentSection } = useContent();
  
  const contentDisplay = useMemo(() => 
    contentSections.map(section => ContentSelectors.getContentDisplay(section)), 
    [contentSections]
  );
  
  const contentStats = useMemo(() => 
    ContentSelectors.getContentSummary(contentSections), 
    [contentSections]
  );
  
  return {
    // Données encapsulées
    content: contentDisplay,
    stats: contentStats,
    
    // États
    loading,
    error,
    
    // Actions
    createContent: createContentSection,
    updateContent: updateContentSection,
    deleteContent: deleteContentSection,
    
    // Méthodes utilitaires
    findByKey: (key: string) => ContentSelectors.getContentByKey(contentSections, key)
  };
};
