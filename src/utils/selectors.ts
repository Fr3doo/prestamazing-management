
// Selectors pour encapsuler l'accès aux données complexes
// Évite le chaînage d'objets et respecte la Loi de Déméter

import { ContactInfo } from '@/interfaces/repositories/IContactRepository';
import { Review } from '@/interfaces/repositories/IReviewRepository';
import { Partner } from '@/interfaces/repositories/IPartnerRepository';
import { ContentSection } from '@/interfaces/repositories/IContentRepository';

// Contact selectors
export const ContactSelectors = {
  getContactsByType: (contacts: ContactInfo[], type: string) => 
    contacts.filter(contact => contact.type === type),
  
  getDisplayValue: (contact: ContactInfo) => ({
    value: contact.value,
    label: contact.label || contact.type,
    displayText: contact.label ? `${contact.label}: ${contact.value}` : contact.value
  }),
  
  getFormattedContact: (contact: ContactInfo) => ({
    id: contact.id,
    type: contact.type,
    displayValue: ContactSelectors.getDisplayValue(contact).displayText,
    canEdit: true,
    lastUpdated: contact.updated_at
  })
};

// Review selectors
export const ReviewSelectors = {
  getAverageRating: (reviews: Review[]) => {
    if (reviews.length === 0) return 0;
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return Math.round((total / reviews.length) * 10) / 10;
  },
  
  getReviewSummary: (review: Review) => ({
    id: review.id,
    authorName: review.user_name,
    rating: review.rating,
    shortComment: review.comment.length > 100 
      ? review.comment.substring(0, 100) + '...' 
      : review.comment,
    fullComment: review.comment,
    isRecent: new Date(review.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  }),
  
  getFilteredReviews: (reviews: Review[], minRating?: number) =>
    minRating ? reviews.filter(review => review.rating >= minRating) : reviews
};

// Partner selectors
export const PartnerSelectors = {
  getOrderedPartners: (partners: Partner[]) =>
    [...partners].sort((a, b) => a.display_order - b.display_order),
  
  getPartnerDisplay: (partner: Partner) => ({
    id: partner.id,
    name: partner.partner_name,
    logoUrl: partner.logo_url,
    websiteUrl: partner.website_url,
    hasWebsite: Boolean(partner.website_url),
    order: partner.display_order
  }),
  
  getNextDisplayOrder: (partners: Partner[]) =>
    partners.length > 0 ? Math.max(...partners.map(p => p.display_order)) + 1 : 1
};

// Content selectors
export const ContentSelectors = {
  getContentByKey: (sections: ContentSection[], key: string) =>
    sections.find(section => section.section_key === key),
  
  getContentDisplay: (section: ContentSection) => ({
    id: section.id,
    key: section.section_key,
    title: section.title || 'Sans titre',
    hasContent: Boolean(section.content),
    hasImage: Boolean(section.image_url),
    shortContent: section.content 
      ? (section.content.length > 150 
          ? section.content.substring(0, 150) + '...' 
          : section.content)
      : 'Aucun contenu',
    lastUpdated: section.updated_at
  }),
  
  getContentSummary: (sections: ContentSection[]) => ({
    total: sections.length,
    withContent: sections.filter(s => s.content).length,
    withImages: sections.filter(s => s.image_url).length,
    withTitles: sections.filter(s => s.title).length
  })
};
