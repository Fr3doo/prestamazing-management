
import { supabase } from '@/integrations/supabase/client';
import { 
  IContentRepository, 
  ContentSection, 
  CreateContentSectionData,
  UpdateContentSectionData
} from '@/interfaces/repositories/IContentRepository';

export class SupabaseContentRepository implements IContentRepository {
  async getAllContentSections(): Promise<ContentSection[]> {
    const { data, error } = await supabase
      .from('content_sections')
      .select('*')
      .order('section_key', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  async getContentSectionById(id: string): Promise<ContentSection | null> {
    const { data, error } = await supabase
      .from('content_sections')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    return data;
  }

  async getContentSectionByKey(key: string): Promise<ContentSection | null> {
    const { data, error } = await supabase
      .from('content_sections')
      .select('*')
      .eq('section_key', key)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    return data;
  }

  async createContentSection(data: CreateContentSectionData): Promise<ContentSection> {
    const { data: result, error } = await supabase
      .from('content_sections')
      .insert([data])
      .select()
      .single();

    if (error) throw error;
    return result;
  }

  async updateContentSection(id: string, data: UpdateContentSectionData): Promise<ContentSection> {
    const { data: result, error } = await supabase
      .from('content_sections')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return result;
  }

  async deleteContentSection(id: string): Promise<void> {
    const { error } = await supabase
      .from('content_sections')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
}
