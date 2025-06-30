
import { supabase } from '@/integrations/supabase/client';
import { 
  IContactRepository, 
  ContactInfo, 
  ContactSubmission,
  CreateContactInfoData,
  CreateContactSubmissionData
} from '@/interfaces/repositories/IContactRepository';

export class SupabaseContactRepository implements IContactRepository {
  async getAllContactInfo(): Promise<ContactInfo[]> {
    const { data, error } = await supabase
      .from('contact_info')
      .select('*')
      .order('type', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  async getContactInfoById(id: string): Promise<ContactInfo | null> {
    const { data, error } = await supabase
      .from('contact_info')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    return data;
  }

  async createContactInfo(data: CreateContactInfoData): Promise<ContactInfo> {
    const { data: result, error } = await supabase
      .from('contact_info')
      .insert([{
        type: data.type.trim(),
        value: data.value.trim(),
        label: data.label?.trim() || null,
      }])
      .select()
      .single();

    if (error) throw error;
    return result;
  }

  async updateContactInfo(id: string, data: Partial<CreateContactInfoData>): Promise<ContactInfo> {
    const updateData: any = {
      updated_at: new Date().toISOString(),
    };

    if (data.type) updateData.type = data.type.trim();
    if (data.value) updateData.value = data.value.trim();
    if (data.label !== undefined) updateData.label = data.label?.trim() || null;

    const { data: result, error } = await supabase
      .from('contact_info')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return result;
  }

  async deleteContactInfo(id: string): Promise<void> {
    const { error } = await supabase
      .from('contact_info')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  async createContactSubmission(data: CreateContactSubmissionData): Promise<ContactSubmission> {
    const { data: result, error } = await supabase
      .from('contact_submissions')
      .insert([data])
      .select()
      .single();

    if (error) throw error;
    return result;
  }

  async getAllContactSubmissions(): Promise<ContactSubmission[]> {
    const { data, error } = await supabase
      .from('contact_submissions')
      .select('*')
      .order('submitted_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }
}
