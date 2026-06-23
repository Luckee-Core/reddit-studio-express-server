import type { SupabaseClient } from '@supabase/supabase-js';
import type { BusinessAccountRow } from './types';

/**
 * Fetches one business account row by id.
 */
export const selectBusinessAccountById = async (
  supabase: SupabaseClient,
  businessAccountId: string,
): Promise<{ row: BusinessAccountRow } | { error: string }> => {
  const { data, error } = await supabase
    .from('business_accounts')
    .select('*')
    .eq('id', businessAccountId)
    .maybeSingle();

  if (error) {
    console.error('❌ selectBusinessAccountById', error);
    return { error: error.message };
  }

  if (!data) {
    return { error: 'Business account not found' };
  }

  return { row: data as BusinessAccountRow };
};
