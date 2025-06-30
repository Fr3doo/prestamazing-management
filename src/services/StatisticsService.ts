import { supabase } from '@/integrations/supabase/client';
import { AdminStats, IStatisticsService } from '@/interfaces/IStatisticsService';

export class SupabaseStatisticsService implements IStatisticsService {
  async getAdminStats(): Promise<AdminStats> {
    const [reviewsRes, partnersRes, contactsRes, contentRes] = await Promise.all([
      supabase.from('reviews').select('id', { count: 'exact', head: true }),
      supabase.from('partners_logos').select('id', { count: 'exact', head: true }),
      supabase.from('contact_info').select('id', { count: 'exact', head: true }),
      supabase.from('content_sections').select('id', { count: 'exact', head: true })
    ]);

    if (reviewsRes.error) throw reviewsRes.error;
    if (partnersRes.error) throw partnersRes.error;
    if (contactsRes.error) throw contactsRes.error;
    if (contentRes.error) throw contentRes.error;

    return {
      reviews: reviewsRes.count || 0,
      partners: partnersRes.count || 0,
      contacts: contactsRes.count || 0,
      content: contentRes.count || 0
    };
  }
}

export const statisticsService = new SupabaseStatisticsService();
