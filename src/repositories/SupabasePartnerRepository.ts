
import { supabase } from '@/integrations/supabase/client';
import { 
  IPartnerRepository, 
  Partner, 
  CreatePartnerData,
  UpdatePartnerData
} from '@/interfaces/repositories/IPartnerRepository';

export class SupabasePartnerRepository implements IPartnerRepository {
  async getAllPartners(): Promise<Partner[]> {
    const { data, error } = await supabase
      .from('partners_logos')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  async getPartnerById(id: string): Promise<Partner | null> {
    const { data, error } = await supabase
      .from('partners_logos')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    return data;
  }

  async createPartner(data: CreatePartnerData): Promise<Partner> {
    const { data: result, error } = await supabase
      .from('partners_logos')
      .insert([{
        ...data,
        display_order: data.display_order ?? 0,
      }])
      .select()
      .single();

    if (error) throw error;
    return result;
  }

  async updatePartner(id: string, data: UpdatePartnerData): Promise<Partner> {
    const { data: result, error } = await supabase
      .from('partners_logos')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return result;
  }

  async deletePartner(id: string): Promise<void> {
    const { error } = await supabase
      .from('partners_logos')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  async updatePartnerOrder(partnerId: string, newOrder: number): Promise<void> {
    const { error } = await supabase
      .from('partners_logos')
      .update({ display_order: newOrder })
      .eq('id', partnerId);

    if (error) throw error;
  }
}
