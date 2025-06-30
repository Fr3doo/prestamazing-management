
import { SupabaseClient } from '@supabase/supabase-js';

export interface ISupabaseClient {
  client: SupabaseClient;
  from(table: string): any;
  auth: any;
}
