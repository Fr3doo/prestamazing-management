
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useStandardToast } from '@/hooks/useStandardToast';
import { useErrorHandler } from '@/hooks/useErrorHandler';

export interface Partner {
  id: string;
  partner_name: string;
  logo_url: string;
  website_url?: string;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export const usePartnersManagement = () => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { showSuccess } = useStandardToast();
  const { handleError } = useErrorHandler();

  const fetchPartners = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('partners_logos')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setPartners(data || []);
    } catch (error) {
      handleError(error, { logContext: 'Partners fetch' });
    } finally {
      setLoading(false);
    }
  };

  const deletePartner = async (id: string) => {
    try {
      const { error } = await supabase
        .from('partners_logos')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setPartners(prev => prev.filter(partner => partner.id !== id));
      showSuccess("Succès", "Partenaire supprimé avec succès");
    } catch (error) {
      handleError(error, { logContext: 'Partner deletion' });
    }
  };

  const filteredPartners = partners.filter(partner =>
    !searchTerm || 
    partner.partner_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    fetchPartners();
  }, []);

  return {
    partners: filteredPartners,
    loading,
    searchTerm,
    setSearchTerm,
    fetchPartners,
    deletePartner,
  };
};
