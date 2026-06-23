import type { SupabaseClient } from '@supabase/supabase-js';
import { getRedditUserAgent } from '../../utils/reddit';
import { upsertRedditOauthConnection } from '../../data/reddit-oauth-connections';

export type ProcessOauthCallbackInput = {
  businessAccountId: string;
  code: string;
};

/**
 * Exchanges OAuth authorization code for refresh token and stores connection row.
 */
export const processOauthCallback = async (
  supabase: SupabaseClient,
  input: ProcessOauthCallbackInput,
): Promise<{ success: true; redditUsername: string | null } | { success: false; error: string }> => {
  const clientId = process.env.REDDIT_CLIENT_ID?.trim();
  const clientSecret = process.env.REDDIT_CLIENT_SECRET?.trim();
  const redirectUri = process.env.REDDIT_OAUTH_REDIRECT_URI?.trim();

  if (!clientId || !clientSecret || !redirectUri) {
    return {
      success: false,
      error: 'REDDIT_CLIENT_ID, REDDIT_CLIENT_SECRET, and REDDIT_OAUTH_REDIRECT_URI must be configured',
    };
  }

  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  const tokenRes = await fetch('https://www.reddit.com/api/v1/access_token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': getRedditUserAgent(),
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code: input.code,
      redirect_uri: redirectUri,
    }).toString(),
  });

  if (!tokenRes.ok) {
    const errText = await tokenRes.text();
    return {
      success: false,
      error: `Reddit OAuth token exchange failed (${tokenRes.status}): ${errText.slice(0, 240)}`,
    };
  }

  const tokenJson = (await tokenRes.json()) as {
    access_token?: string;
    refresh_token?: string;
    expires_in?: number;
  };

  const refreshToken = tokenJson.refresh_token?.trim();
  const accessToken = tokenJson.access_token?.trim();
  if (!refreshToken || !accessToken) {
    return { success: false, error: 'Reddit OAuth response missing refresh_token or access_token' };
  }

  const expiresInSec = typeof tokenJson.expires_in === 'number' ? tokenJson.expires_in : 3600;
  const expiresAt = new Date(Date.now() + expiresInSec * 1000).toISOString();

  const meRes = await fetch('https://oauth.reddit.com/api/v1/me', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'User-Agent': getRedditUserAgent(),
    },
  });

  let redditUserId: string | null = null;
  let redditUsername: string | null = null;
  if (meRes.ok) {
    const me = (await meRes.json()) as { id?: string; name?: string };
    redditUserId = me.id?.trim() || null;
    redditUsername = me.name?.trim() || null;
  }

  const upsertResult = await upsertRedditOauthConnection(supabase, {
    businessAccountId: input.businessAccountId,
    refreshToken,
    accessToken,
    expiresAt,
    redditUserId,
    redditUsername,
  });

  if ('error' in upsertResult) {
    return { success: false, error: upsertResult.error };
  }

  if (redditUsername) {
    await supabase
      .from('business_accounts')
      .update({ reddit_username: redditUsername, updated_at: new Date().toISOString() })
      .eq('id', input.businessAccountId);
  }

  console.log('✅ [reddit.processOauthCallback]', { redditUsername });
  return { success: true, redditUsername };
};
