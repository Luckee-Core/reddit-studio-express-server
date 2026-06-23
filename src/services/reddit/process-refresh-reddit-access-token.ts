import type { SupabaseClient } from '@supabase/supabase-js';
import { getRedditUserAgent } from '../../utils/reddit';
import {
  selectRedditOauthConnectionByBusinessAccountId,
  upsertRedditOauthConnection,
} from '../../data/reddit-oauth-connections';
import type { RedditAccessTokenResult } from './types';

const TOKEN_BUFFER_MS = 60_000;

const getRedditOAuthCredentials = (): { clientId: string; clientSecret: string } | null => {
  const clientId = process.env.REDDIT_CLIENT_ID?.trim();
  const clientSecret = process.env.REDDIT_CLIENT_SECRET?.trim();
  if (!clientId || !clientSecret) return null;
  return { clientId, clientSecret };
};

/**
 * Returns a valid Reddit user access token for the business account (refresh if needed).
 */
export const processRefreshRedditAccessToken = async (
  supabase: SupabaseClient,
  businessAccountId: string,
): Promise<RedditAccessTokenResult> => {
  const creds = getRedditOAuthCredentials();
  if (!creds) {
    return { ok: false, error: 'REDDIT_CLIENT_ID and REDDIT_CLIENT_SECRET must be configured' };
  }

  const connectionResult = await selectRedditOauthConnectionByBusinessAccountId(
    supabase,
    businessAccountId,
  );
  if ('error' in connectionResult) {
    return { ok: false, error: connectionResult.error };
  }

  const row = connectionResult.row;
  const expiresAtMs = row.expires_at ? new Date(row.expires_at).getTime() : 0;
  if (row.access_token && expiresAtMs > Date.now() + TOKEN_BUFFER_MS) {
    return { ok: true, accessToken: row.access_token };
  }

  const credentials = Buffer.from(`${creds.clientId}:${creds.clientSecret}`).toString('base64');
  const res = await fetch('https://www.reddit.com/api/v1/access_token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': getRedditUserAgent(),
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: row.refresh_token,
    }).toString(),
  });

  if (!res.ok) {
    const errText = await res.text();
    return { ok: false, error: `Reddit token refresh failed (${res.status}): ${errText.slice(0, 240)}` };
  }

  const json = (await res.json()) as {
    access_token?: string;
    expires_in?: number;
    refresh_token?: string;
  };

  const accessToken = json.access_token?.trim();
  if (!accessToken) {
    return { ok: false, error: 'Reddit token refresh response missing access_token' };
  }

  const expiresInSec = typeof json.expires_in === 'number' ? json.expires_in : 3600;
  const expiresAt = new Date(Date.now() + expiresInSec * 1000).toISOString();
  const refreshToken = json.refresh_token?.trim() || row.refresh_token;

  const upsertResult = await upsertRedditOauthConnection(supabase, {
    businessAccountId,
    refreshToken,
    accessToken,
    expiresAt,
    redditUserId: row.reddit_user_id,
    redditUsername: row.reddit_username,
  });

  if ('error' in upsertResult) {
    return { ok: false, error: upsertResult.error };
  }

  return { ok: true, accessToken };
};
