
import React, { createContext, useContext, ReactNode } from 'react';
import { IAuthService } from '@/interfaces/IAuthService';
import { IAdminService } from '@/interfaces/IAdminService';
import { ISecurityService } from '@/interfaces/ISecurityService';
import { ISupabaseClient } from '@/interfaces/ISupabaseClient';
import { AuthService } from '@/services/AuthService';
import { AdminService } from '@/services/AdminService';
import { securityMonitor } from '@/utils/securityMonitoring';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

interface ServiceContextType {
  authService: IAuthService;
  adminService: IAdminService;
  securityService: ISecurityService;
  supabaseClient: ISupabaseClient;
}

const ServiceContext = createContext<ServiceContextType | undefined>(undefined);

interface ServiceProviderProps {
  children: ReactNode;
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

export const ServiceProvider: React.FC<ServiceProviderProps> = ({ children }) => {
  const supabaseClient = new SupabaseClientWrapper();
  
  const services: ServiceContextType = {
    authService: AuthService,
    adminService: AdminService,
    securityService: securityMonitor,
    supabaseClient,
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
