import { createClient } from '@supabase/supabase-js';
import { setManagedSupabaseClient } from './clients';

/**
 * Initializes managed service clients from environment variables.
 */
export const initManagedClients = async (): Promise<void> => {
  console.log('🚀 Initializing managed clients');

  const supabaseUrl = process.env.SUPABASE_URL?.trim();
  const supabaseKey = process.env.SUPABASE_SERVICE_KEY?.trim();

  if (supabaseUrl && supabaseKey) {
    setManagedSupabaseClient(createClient(supabaseUrl, supabaseKey));
    console.log('✅ Supabase client initialized');
  } else {
    console.warn('⚠️ Supabase not configured (SUPABASE_URL, SUPABASE_SERVICE_KEY)');
  }
};
