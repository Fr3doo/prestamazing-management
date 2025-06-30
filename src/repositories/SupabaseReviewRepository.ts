
import { supabase } from '@/integrations/supabase/client';
import { 
  IReviewRepository, 
  Review, 
  CreateReviewData,
  UpdateReviewData
} from '@/interfaces/repositories/IReviewRepository';

export class SupabaseReviewRepository implements IReviewRepository {
  async getAllReviews(): Promise<Review[]> {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async getReviewById(id: string): Promise<Review | null> {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    return data;
  }

  async createReview(data: CreateReviewData): Promise<Review> {
    const { data: result, error } = await supabase
      .from('reviews')
      .insert([data])
      .select()
      .single();

    if (error) throw error;
    return result;
  }

  async updateReview(id: string, data: UpdateReviewData): Promise<Review> {
    const { data: result, error } = await supabase
      .from('reviews')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return result;
  }

  async deleteReview(id: string): Promise<void> {
    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
}
