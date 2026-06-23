import type { SupabaseClient } from '@supabase/supabase-js';
import type { RedditOauthConnectionRow } from './types';

/**
 * Loads OAuth connection row for one business account.
 */
export const selectRedditOauthConnectionByBusinessAccountId = async (
  supabase: SupabaseClient,
  businessAccountId: string,
): Promise<{ row: RedditOauthConnectionRow } | { error: string }> => {
  console.log('💾 selectRedditOauthConnectionByBusinessAccountId', { businessAccountId });
  const { data, error } = await supabase
    .from('reddit_oauth_connections')
    .select('*')
    .eq('business_account_id', businessAccountId)
    .maybeSingle();

  if (error) {
    console.error('❌ selectRedditOauthConnectionByBusinessAccountId', error);
    return { error: error.message };
  }

  if (!data) {
    return { error: 'Reddit account not connected for this business account' };
  }

  return { row: data as RedditOauthConnectionRow };
};
