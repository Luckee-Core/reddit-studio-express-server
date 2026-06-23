import type { SupabaseClient } from '@supabase/supabase-js';
import type { RedditOauthConnectionRow, UpsertRedditOauthConnectionInput } from './types';

/**
 * Inserts or updates OAuth tokens for a business account.
 */
export const upsertRedditOauthConnection = async (
  supabase: SupabaseClient,
  input: UpsertRedditOauthConnectionInput,
): Promise<{ row: RedditOauthConnectionRow } | { error: string }> => {
  console.log('💾 upsertRedditOauthConnection', { businessAccountId: input.businessAccountId });
  const { data, error } = await supabase
    .from('reddit_oauth_connections')
    .upsert(
      {
        business_account_id: input.businessAccountId,
        refresh_token: input.refreshToken,
        access_token: input.accessToken ?? null,
        expires_at: input.expiresAt ?? null,
        reddit_user_id: input.redditUserId ?? null,
        reddit_username: input.redditUsername ?? null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'business_account_id' },
    )
    .select('*')
    .single();

  if (error) {
    console.error('❌ upsertRedditOauthConnection', error);
    return { error: error.message };
  }

  return { row: data as RedditOauthConnectionRow };
};
