
import React, { createContext, useContext, ReactNode } from 'react';
import { IAuthService } from '@/interfaces/IAuthService';
import { IAdminService } from '@/interfaces/IAdminService';
import { ISecurityService } from '@/interfaces/ISecurityService';
import { ISupabaseClient } from '@/interfaces/ISupabaseClient';
import { IContactRepository } from '@/interfaces/repositories/IContactRepository';
import { IReviewRepository } from '@/interfaces/repositories/IReviewRepository';
import { IContentRepository } from '@/interfaces/repositories/IContentRepository';
import { IPartnerRepository } from '@/interfaces/repositories/IPartnerRepository';
import { IStatisticsService } from '@/interfaces/IStatisticsService';
import { IPartnerService } from '@/interfaces/IPartnerService';
import { AuthService } from '@/services/AuthService';
import { AdminService } from '@/services/AdminService';
import { securityMonitor } from '@/utils/securityMonitoring';
import { supabase } from '@/integrations/supabase/client';
import { SupabaseContactRepository } from '@/repositories/SupabaseContactRepository';
import { SupabaseReviewRepository } from '@/repositories/SupabaseReviewRepository';
import { SupabaseContentRepository } from '@/repositories/SupabaseContentRepository';
import { SupabasePartnerRepository } from '@/repositories/SupabasePartnerRepository';
import { statisticsService } from '@/services/StatisticsService';
import { PartnerService } from '@/services/PartnerService';
import type { Database } from '@/integrations/supabase/types';

interface ServiceContextType {
  authService: IAuthService;
  adminService: IAdminService;
  securityService: ISecurityService;
  supabaseClient: ISupabaseClient;
  // Nouveaux repositories
  contactRepository: IContactRepository;
  reviewRepository: IReviewRepository;
  contentRepository: IContentRepository;
  partnerRepository: IPartnerRepository;
  statisticsService: IStatisticsService;
  partnerService: IPartnerService;
}

const ServiceContext = createContext<ServiceContextType | undefined>(undefined);

interface ServiceProviderProps {
  children: ReactNode;
  // Permet l'injection de repositories pour les tests
  contactRepository?: IContactRepository;
  reviewRepository?: IReviewRepository;
  contentRepository?: IContentRepository;
  partnerRepository?: IPartnerRepository;
  statisticsService?: IStatisticsService;
  partnerService?: IPartnerService;
}

// Wrapper pour Supabase client
class SupabaseClientWrapper implements ISupabaseClient {
  client = supabase;
  
  from<T extends keyof Database['public']['Tables']>(table: T) {
    return this.client.from(table);
  }
  
  get auth() {
    return this.client.auth;
  }
}

export const ServiceProvider: React.FC<ServiceProviderProps> = ({ 
  children,
  contactRepository,
  reviewRepository,
  contentRepository,
  partnerRepository,
  statisticsService: injectedStatisticsService,
  partnerService: injectedPartnerService
}) => {
  const supabaseClient = new SupabaseClientWrapper();

  const services: ServiceContextType = {
    authService: AuthService,
    adminService: AdminService,
    securityService: securityMonitor,
    supabaseClient,
    // Injection des repositories avec fallback vers les implémentations Supabase
    contactRepository: contactRepository || new SupabaseContactRepository(),
    reviewRepository: reviewRepository || new SupabaseReviewRepository(),
    contentRepository: contentRepository || new SupabaseContentRepository(),
    partnerRepository: partnerRepository || new SupabasePartnerRepository(),
    statisticsService: injectedStatisticsService || statisticsService,
    partnerService: injectedPartnerService || new PartnerService(partnerRepository || new SupabasePartnerRepository()),
  };

  return (
    <ServiceContext.Provider value={services}>
      {children}
    </ServiceContext.Provider>
  );
};

export const useServices = (): ServiceContextType => {
  const context = useContext(ServiceContext);
  if (context === undefined) {
    throw new Error('useServices must be used within a ServiceProvider');
  }
  return context;
};
