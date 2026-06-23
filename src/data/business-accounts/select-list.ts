import type { SupabaseClient } from '@supabase/supabase-js';
import type { BusinessAccountRow } from './types';

/**
 * Lists all business accounts ordered for sidebar display.
 */
export const selectBusinessAccountList = async (
  supabase: SupabaseClient,
): Promise<{ rows: BusinessAccountRow[] } | { error: string }> => {
  const { data, error } = await supabase
    .from('business_accounts')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('label', { ascending: true });

  if (error) {
    console.error('❌ selectBusinessAccountList', error);
    return { error: error.message };
  }

  return { rows: (data ?? []) as BusinessAccountRow[] };
};
