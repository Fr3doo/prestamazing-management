
import { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';

export interface ISupabaseClient {
  client: SupabaseClient<Database>;
  from<T extends keyof Database['public']['Tables']>(table: T): any;
  auth: any;
}
