import { createClient, SupabaseClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export function isSupabaseConfigured(): boolean {
  return !!url && !!anonKey;
}

export const supabase: SupabaseClient | null = isSupabaseConfigured()
  ? createClient(url as string, anonKey as string)
  : null;
