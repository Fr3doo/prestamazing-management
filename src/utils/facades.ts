
// Facades pour encapsuler la complexité des objets
// Fournit une interface simple pour des opérations complexes

import { ContactInfo } from '@/interfaces/repositories/IContactRepository';
import { Review } from '@/interfaces/repositories/IReviewRepository';
import { Partner } from '@/interfaces/repositories/IPartnerRepository';
import { ContactSelectors, ReviewSelectors, PartnerSelectors } from './selectors';

// Facade pour la gestion des contacts
export class ContactFacade {
  constructor(private contacts: ContactInfo[]) {}
  
  getContactTypes() {
    const types = new Set(this.contacts.map(c => c.type));
    return Array.from(types);
  }
  
  getContactsForDisplay() {
    return this.contacts.map(contact => 
      ContactSelectors.getFormattedContact(contact)
    );
  }
  
  findContactsByType(type: string) {
    return ContactSelectors.getContactsByType(this.contacts, type);
  }
  
  getContactStats() {
    const types = this.getContactTypes();
    return {
      total: this.contacts.length,
      types: types.length,
      typeBreakdown: types.map(type => ({
        type,
        count: this.findContactsByType(type).length
      }))
    };
  }
}

// Facade pour la gestion des avis
export class ReviewFacade {
  constructor(private reviews: Review[]) {}
  
  getReviewStats() {
    return {
      total: this.reviews.length,
      averageRating: ReviewSelectors.getAverageRating(this.reviews),
      ratingDistribution: this.getRatingDistribution(),
      recentCount: this.getRecentReviews().length
    };
  }
  
  private getRatingDistribution() {
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    this.reviews.forEach(review => {
      distribution[review.rating as keyof typeof distribution]++;
    });
    return distribution;
  }
  
  getRecentReviews() {
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    return this.reviews.filter(review => 
      new Date(review.created_at) > weekAgo
    );
  }
  
  getTopRatedReviews(minRating = 4) {
    return ReviewSelectors.getFilteredReviews(this.reviews, minRating)
      .map(review => ReviewSelectors.getReviewSummary(review));
  }
  
  getReviewsForDisplay() {
    return this.reviews.map(review => 
      ReviewSelectors.getReviewSummary(review)
    );
  }
}

// Facade pour la gestion des partenaires
export class PartnerFacade {
  constructor(private partners: Partner[]) {}
  
  getPartnersForDisplay() {
    return PartnerSelectors.getOrderedPartners(this.partners)
      .map(partner => PartnerSelectors.getPartnerDisplay(partner));
  }
  
  getPartnerStats() {
    return {
      total: this.partners.length,
      withWebsites: this.partners.filter(p => p.website_url).length,
      maxOrder: this.partners.length > 0 
        ? Math.max(...this.partners.map(p => p.display_order))
        : 0
    };
  }
  
  getNextOrder() {
    return PartnerSelectors.getNextDisplayOrder(this.partners);
  }
  
  reorderPartners(fromIndex: number, toIndex: number) {
    const orderedPartners = PartnerSelectors.getOrderedPartners(this.partners);
    const [removed] = orderedPartners.splice(fromIndex, 1);
    orderedPartners.splice(toIndex, 0, removed);
    
    return orderedPartners.map((partner, index) => ({
      id: partner.id,
      newOrder: index + 1
    }));
  }
}
